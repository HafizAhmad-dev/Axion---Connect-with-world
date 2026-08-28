"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const db_conn_js_1 = __importDefault(require("../database/db.conn.js"));
const migrationsDir = node_path_1.default.join(process.cwd(), "database", "migrations");
async function migrate() {
    const client = await db_conn_js_1.default.connect();
    try {
        // Create migration tracking table
        await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        filename TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);
        // Find all SQL migration files
        const files = (await promises_1.default.readdir(migrationsDir))
            .filter((file) => file.endsWith(".sql"))
            .sort();
        // Get already-applied migrations
        const result = await client.query(`
      SELECT filename
      FROM schema_migrations
    `);
        const applied = new Set(result.rows.map((row) => row.filename));
        for (const file of files) {
            if (applied.has(file)) {
                console.log(`⏭️  Skipping ${file}`);
                continue;
            }
            console.log(`🚀 Running ${file}`);
            const filePath = node_path_1.default.join(migrationsDir, file);
            const sql = await promises_1.default.readFile(filePath, "utf8");
            try {
                await client.query("BEGIN");
                await client.query(sql);
                await client.query(`
            INSERT INTO schema_migrations (filename)
            VALUES ($1)
          `, [file]);
                await client.query("COMMIT");
                console.log(`✅ Applied ${file}`);
            }
            catch (error) {
                await client.query("ROLLBACK");
                console.error(`❌ Migration failed: ${file}`);
                throw error;
            }
        }
        console.log("🎉 Migrations complete");
    }
    finally {
        client.release();
        await db_conn_js_1.default.end();
    }
}
migrate().catch((error) => {
    console.error(error);
    process.exit(1);
});
