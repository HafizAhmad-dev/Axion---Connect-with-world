// database/models/message.model.ts

import pool from "../db.conn";

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}


// Send a new message
export async function sendMessage(
  conversationId: string,
  senderId: string,
  content: string
): Promise<Message> {
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
    const result = await pool.query(query, [
      conversationId,
      senderId,
      content.trim(),
    ]);

    return result.rows[0];
  } catch (error) {
    console.error("Error sending message:", error);
    throw new Error("Failed to send message");
  }
}


// Get messages for a conversation
export async function getMessages(
  conversationId: string,
  limit: number = 50,
  offset: number = 0
): Promise<Message[]> {
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
    const result = await pool.query(query, [
      conversationId,
      limit,
      offset,
    ]);

    return result.rows;
  } catch (error) {
    console.error("Error getting messages:", error);
    throw new Error("Failed to get messages");
  }
}


// Get last message of a conversation
export async function getLastMessage(
  conversationId: string
): Promise<Message | null> {
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
    const result = await pool.query(query, [conversationId]);
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error getting last message:", error);
    return null;
  }
}


// Mark conversation as read for one participant
export async function markMessagesAsRead(
  conversationId: string,
  userId: string
): Promise<void> {
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
    await pool.query(query, [conversationId, userId]);
  } catch (error) {
    console.error("Error marking conversation as read:", error);
    throw new Error("Failed to mark conversation as read");
  }
}


// Get unread count for one participant
export async function getUnreadCount(
  conversationId: string,
  userId: string
): Promise<number> {
  const query = `
    SELECT unread_count
    FROM conversation_participants
    WHERE
      conversation_id = $1
      AND user_id = $2
  `;

  try {
    const result = await pool.query(query, [
      conversationId,
      userId,
    ]);

    return result.rows[0]?.unread_count ?? 0;
  } catch (error) {
    console.error("Error getting unread count:", error);
    return 0;
  }
}


// Delete a message
export async function deleteMessage(
  messageId: string,
  userId: string
): Promise<boolean> {
  const query = `
    DELETE FROM messages
    WHERE id = $1
      AND sender_id = $2
    RETURNING id
  `;

  try {
    const result = await pool.query(query, [
      messageId,
      userId,
    ]);

    return result.rowCount! > 0;
  } catch (error) {
    console.error("Error deleting message:", error);
    return false;
  }
}