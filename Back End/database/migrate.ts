import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pool from "../database/db.conn.js";

const migrationsDir = path.join(process.cwd(), "database", "migrations");

async function migrate() {
  const client = await pool.connect();

  try {
    // Create migration tracking table
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        filename TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // Find all SQL migration files
    const files = (await fs.readdir(migrationsDir))
      .filter((file) => file.endsWith(".sql"))
      .sort();

    // Get already-applied migrations
    const result = await client.query<{ filename: string }>(`
      SELECT filename
      FROM schema_migrations
    `);

    const applied = new Set(
      result.rows.map((row) => row.filename)
    );

    for (const file of files) {
      if (applied.has(file)) {
        console.log(`⏭️  Skipping ${file}`);
        continue;
      }

      console.log(`🚀 Running ${file}`);

      const filePath = path.join(migrationsDir, file);
      const sql = await fs.readFile(filePath, "utf8");

      try {
        await client.query("BEGIN");

        await client.query(sql);

        await client.query(
          `
            INSERT INTO schema_migrations (filename)
            VALUES ($1)
          `,
          [file]
        );

        await client.query("COMMIT");

        console.log(`✅ Applied ${file}`);
      } catch (error) {
        await client.query("ROLLBACK");

        console.error(`❌ Migration failed: ${file}`);
        throw error;
      }
    }

    console.log("🎉 Migrations complete");
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch((error) => {
  console.error(error);
  process.exit(1);
});