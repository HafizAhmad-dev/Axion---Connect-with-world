"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfileMODEL = void 0;
const db_conn_1 = __importDefault(require("../db.conn"));
const getUserProfileMODEL = async (userId) => {
    const query = `
    SELECT
      id,
      username,
      displayname,
      email,
      created at
    FROM users
    WHERE id = $1
  `;
    const result = await db_conn_1.default.query(query, [userId]);
    return result.rows[0] ?? null;
};
exports.getUserProfileMODEL = getUserProfileMODEL;
