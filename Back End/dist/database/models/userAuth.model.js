"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.SignModule = SignModule;
exports.verifyUserMODULE = verifyUserMODULE;
const db_conn_1 = __importDefault(require("../db.conn"));
//registration module
async function createUser(username, email, password, displayName = username) {
    const query = "INSERT INTO users (username, displayName, email, password) VALUES ($1, $2, $3, $4) RETURNING id, username,displayName, email, createdAt";
    const values = [username, displayName, email, password];
    try {
        const result = await db_conn_1.default.query(query, values);
        return result.rows[0];
    }
    catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
}
// =========================   SIGN MODULE =========================
async function SignModule(identifier) {
    const query = `SELECT username, displayName, email, id, password FROM users WHERE email = $1 OR username = $1`;
    const value = [identifier];
    try {
        const result = await db_conn_1.default.query(query, value);
        return result.rows[0];
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}
// verify user module
async function verifyUserMODULE(id) {
    const query = "SELECT id, username, displayName, email, createdAt FROM users WHERE id = $1 ";
    const value = [id];
    try {
        const result = await db_conn_1.default.query(query, value);
        if (result.rows.length === 0) {
            return null; // ← Add this! User not found in database
        }
        return result.rows[0];
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}
