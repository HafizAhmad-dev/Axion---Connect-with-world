import { Pool } from "pg";
import "dotenv/config";

// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "Axion Database",
//   password: "ahmad1234",
//   port: 5432,
// });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
console.log('url',process.env.DATABASE_URL)
// Test connection on startup
pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ Connected to PostgreSQL database");
    release();
  }
});

export default pool;