"use strict";
// database/models/message.model.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = sendMessage;
exports.getMessages = getMessages;
exports.getLastMessage = getLastMessage;
exports.markMessagesAsRead = markMessagesAsRead;
exports.getUnreadCount = getUnreadCount;
exports.deleteMessage = deleteMessage;
const db_conn_1 = __importDefault(require("../db.conn"));
// Send a new message
async function sendMessage(conversationId, senderId, content) {
    const query = `
    INSERT INTO messages (
      conversation_id,
      sender_id,
      content
    )
    VALUES ($1, $2, $3)
    RETURNING
      id,
      conversation_id AS "conversationId",
      sender_id AS "senderId",
      content,
      created_at AS "createdAt",
      updated_at AS "updatedAt"
  `;
    try {
        const result = await db_conn_1.default.query(query, [
            conversationId,
            senderId,
            content.trim(),
        ]);
        return result.rows[0];
    }
    catch (error) {
        console.error("Error sending message:", error);
        throw new Error("Failed to send message");
    }
}
// Get messages for a conversation
async function getMessages(conversationId, limit = 50, offset = 0) {
    const query = `
    SELECT *
    FROM (
      SELECT
        id,
        conversation_id AS "conversationId",
        sender_id AS "senderId",
        content,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM messages
      WHERE conversation_id = $1
      ORDER BY created_at DESC
      LIMIT $2
      OFFSET $3
    ) AS latest_messages
    ORDER BY "createdAt" ASC
  `;
    try {
        const result = await db_conn_1.default.query(query, [
            conversationId,
            limit,
            offset,
        ]);
        return result.rows;
    }
    catch (error) {
        console.error("Error getting messages:", error);
        throw new Error("Failed to get messages");
    }
}
// Get last message of a conversation
async function getLastMessage(conversationId) {
    const query = `
    SELECT
      id,
      conversation_id AS "conversationId",
      sender_id AS "senderId",
      content,
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    FROM messages
    WHERE conversation_id = $1
    ORDER BY created_at DESC
    LIMIT 1
  `;
    try {
        const result = await db_conn_1.default.query(query, [conversationId]);
        return result.rows[0] || null;
    }
    catch (error) {
        console.error("Error getting last message:", error);
        return null;
    }
}
// Mark conversation as read for one participant
async function markMessagesAsRead(conversationId, userId) {
    const query = `
    UPDATE conversation_participants
    SET
      unread_count = 0,
      last_read_at = NOW()
    WHERE
      conversation_id = $1
      AND user_id = $2
  `;
    try {
        await db_conn_1.default.query(query, [conversationId, userId]);
    }
    catch (error) {
        console.error("Error marking conversation as read:", error);
        throw new Error("Failed to mark conversation as read");
    }
}
// Get unread count for one participant
async function getUnreadCount(conversationId, userId) {
    const query = `
    SELECT unread_count
    FROM conversation_participants
    WHERE
      conversation_id = $1
      AND user_id = $2
  `;
    try {
        const result = await db_conn_1.default.query(query, [
            conversationId,
            userId,
        ]);
        return result.rows[0]?.unread_count ?? 0;
    }
    catch (error) {
        console.error("Error getting unread count:", error);
        return 0;
    }
}
// Delete a message
async function deleteMessage(messageId, userId) {
    const query = `
    DELETE FROM messages
    WHERE id = $1
      AND sender_id = $2
    RETURNING id
  `;
    try {
        const result = await db_conn_1.default.query(query, [
            messageId,
            userId,
        ]);
        return result.rowCount > 0;
    }
    catch (error) {
        console.error("Error deleting message:", error);
        return false;
    }
}
