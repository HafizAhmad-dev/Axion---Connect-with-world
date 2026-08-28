"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.acceptFriendRequest = acceptFriendRequest;
exports.getFriendsModel = getFriendsModel;
const db_conn_1 = __importDefault(require("../db.conn"));
async function acceptFriendRequest(requestId, currentUserId) {
    const client = await db_conn_1.default.connect();
    try {
        await client.query('BEGIN');
        // 1. Get the request
        const requestResult = await client.query(`SELECT from_user_id, to_user_id FROM friendRequests WHERE id = $1`, [requestId]);
        if (requestResult.rows.length === 0) {
            throw new Error('Friend request not found');
        }
        const { from_user_id, to_user_id } = requestResult.rows[0];
        // 2. Verify current user is the recipient
        if (to_user_id !== currentUserId) {
            throw new Error('You cannot accept this request');
        }
        // 3. Delete the request
        await client.query(`DELETE FROM friendRequests WHERE id = $1`, [requestId]);
        // 4. Create friendship rows (both directions)
        await client.query(`INSERT INTO friendships (user_id, friend_id) VALUES ($1, $2), ($2, $1)`, [from_user_id, to_user_id]);
        await client.query('COMMIT');
        return {
            success: true,
            friendshipId: from_user_id,
            friendId: from_user_id
        };
    }
    catch (error) {
        await client.query('ROLLBACK');
        console.error('Error accepting friend request:', error);
        throw error;
    }
    finally {
        client.release();
    }
}
async function getFriendsModel(userId, query) {
    const dbquery = `
    SELECT
      u.id,
      u.username,
      u.displayName,
      f.created_at AS "friendsSince"
    FROM friendships f
    JOIN users u
      ON u.id = CASE
        WHEN f.user_id = $1 THEN f.friend_id
        ELSE f.user_id
      END
    WHERE
      (f.user_id = $1 OR f.friend_id = $1)
      AND (
        u.username ILIKE $2
        OR u.displayName ILIKE $2
      )
    ORDER BY f.created_at DESC
  `;
    const values = [userId, `%${query}%`];
    try {
        const result = await db_conn_1.default.query(dbquery, values);
        return result.rows;
    }
    catch (error) {
        console.error("Error fetching friends:", error);
        throw error;
    }
}
