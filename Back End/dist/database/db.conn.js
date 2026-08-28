"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
require("dotenv/config");
// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "Axion Database",
//   password: "ahmad1234",
//   port: 5432,
// });
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
});
console.log('url', process.env.DATABASE_URL);
// Test connection on startup
pool.connect((err, client, release) => {
    if (err) {
        console.error("❌ Database connection failed:", err.message);
    }
    else {
        console.log("✅ Connected to PostgreSQL database");
        release();
    }
});
exports.default = pool;
