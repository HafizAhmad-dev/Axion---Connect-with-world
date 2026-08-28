"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrCreateConversation = getOrCreateConversation;
exports.getUserConversations = getUserConversations;
exports.updateConversationSettings = updateConversationSettings;
exports.updateConversationNickname = updateConversationNickname;
exports.getMessages = getMessages;
exports.sendMessage = sendMessage;
exports.incrementUnreadCount = incrementUnreadCount;
exports.markConversationAsRead = markConversationAsRead;
exports.getConversationById = getConversationById;
exports.getConversationWithMessages = getConversationWithMessages;
exports.isConversationParticipant = isConversationParticipant;
const db_conn_1 = __importDefault(require("../db.conn"));
// ============================================
// GET OR CREATE DIRECT CONVERSATION
// ============================================
async function getOrCreateConversation(userId, friendId) {
    const existing = await db_conn_1.default.query(`SELECT c.id
     FROM conversations c
     JOIN conversation_participants cp1
       ON c.id = cp1.conversation_id
     JOIN conversation_participants cp2
       ON c.id = cp2.conversation_id
     WHERE cp1.user_id = $1
       AND cp2.user_id = $2
       AND c.is_group = false`, [userId, friendId]);
    if (existing.rows.length > 0) {
        return {
            id: existing.rows[0].id,
            isNew: false,
        };
    }
    const newConv = await db_conn_1.default.query(`INSERT INTO conversations (is_group)
     VALUES (false)
     RETURNING id`);
    const conversationId = newConv.rows[0].id;
    await db_conn_1.default.query(`INSERT INTO conversation_participants
      (conversation_id, user_id)
     VALUES ($1, $2), ($1, $3)`, [conversationId, userId, friendId]);
    return {
        id: conversationId,
        isNew: true,
    };
}
// ============================================
// GET ALL CONVERSATIONS FOR A USER
// ============================================
async function getUserConversations(userId) {
    const result = await db_conn_1.default.query(`SELECT
      c.id,
      c.created_at,
      c.updated_at,
      cs.nickname,

      (
        SELECT json_agg(
          json_build_object(
            'id', u.id,
            'username', u.username,
            'displayName', u.displayName,
            'createdAt', u.createdat
          )
          ORDER BY u.id
        )
        FROM conversation_participants cp
        JOIN users u ON cp.user_id = u.id
        WHERE cp.conversation_id = c.id
      ) AS participants,

      (
        SELECT content
        FROM messages
        WHERE conversation_id = c.id
        ORDER BY created_at DESC
        LIMIT 1
      ) AS last_message,

      (
        SELECT created_at
        FROM messages
        WHERE conversation_id = c.id
        ORDER BY created_at DESC
        LIMIT 1
      ) AS last_message_time,

      -- Per-user unread count
      cp.unread_count AS unread_count,

      COALESCE(cs.is_muted, false) AS is_muted,
      COALESCE(cs.is_pinned, false) AS is_pinned,
      COALESCE(cs.is_archived, false) AS is_archived

    FROM conversations c

    -- This participant row belongs to the current user
    JOIN conversation_participants cp
      ON c.id = cp.conversation_id
      AND cp.user_id = $1

    LEFT JOIN conversation_settings cs
      ON c.id = cs.conversation_id
      AND cs.user_id = $1

    ORDER BY
      cs.is_pinned DESC,
      last_message_time DESC NULLS LAST`, [userId]);
    return result.rows.map((row) => ({
        id: row.id,
        participants: row.participants || [],
        nickname: row.nickname || undefined,
        lastMessage: row.last_message,
        lastMessageTime: row.last_message_time,
        unreadCount: parseInt(row.unread_count) || 0,
        settings: {
            isMuted: row.is_muted,
            isPinned: row.is_pinned,
            isArchived: row.is_archived,
        },
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    }));
}
// ============================================
// UPDATE CONVERSATION SETTINGS
// ============================================
async function updateConversationSettings(conversationId, userId, settings) {
    const { isMuted, isPinned, isArchived } = settings;
    await db_conn_1.default.query(`INSERT INTO conversation_settings
      (
        conversation_id,
        user_id,
        is_muted,
        is_pinned,
        is_archived
      )
     VALUES
      (
        $1,
        $2,
        COALESCE($3, false),
        COALESCE($4, false),
        COALESCE($5, false)
      )

     ON CONFLICT (conversation_id, user_id)

     DO UPDATE SET
       is_muted = COALESCE(
         $3,
         conversation_settings.is_muted
       ),

       is_pinned = COALESCE(
         $4,
         conversation_settings.is_pinned
       ),

       is_archived = COALESCE(
         $5,
         conversation_settings.is_archived
       )`, [conversationId, userId, isMuted, isPinned, isArchived]);
}
// ============================================
// UPDATE CONVERSATION NICKNAME
// ============================================
async function updateConversationNickname(conversationId, userId, nickname) {
    await db_conn_1.default.query(`INSERT INTO conversation_settings
      (conversation_id, user_id, nickname)
     VALUES ($1, $2, $3)

     ON CONFLICT (conversation_id, user_id)

     DO UPDATE SET nickname = $3`, [conversationId, userId, nickname]);
}
// ============================================
// GET MESSAGES
// ============================================
async function getMessages(conversationId, limit = 50) {
    const result = await db_conn_1.default.query(`
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
    ) latest_messages

    ORDER BY "createdAt" ASC
    `, [conversationId, limit]);
    return result.rows;
}
// ============================================
// SEND MESSAGE
// ============================================
async function sendMessage(conversationId, senderId, content) {
    const result = await db_conn_1.default.query(`INSERT INTO messages
      (
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
       updated_at AS "updatedAt"`, [conversationId, senderId, content]);
    return result.rows[0];
}
// ============================================
// INCREMENT UNREAD COUNT FOR INACTIVE USERS
// ============================================
async function incrementUnreadCount(conversationId, senderId, activeUserIds) {
    await db_conn_1.default.query(`UPDATE conversation_participants

     SET unread_count = unread_count + 1

     WHERE conversation_id = $1

       -- Sender should never get an unread message
       AND user_id != $2

       -- Users currently viewing the conversation
       -- should stay at 0
       AND NOT (
         user_id = ANY($3::uuid[])
       )`, [conversationId, senderId, activeUserIds]);
}
// ============================================
// MARK CONVERSATION AS READ
// ============================================
async function markConversationAsRead(conversationId, userId) {
    await db_conn_1.default.query(`UPDATE conversation_participants

     SET
       unread_count = 0,
       last_read_at = NOW()

     WHERE conversation_id = $1
       AND user_id = $2`, [conversationId, userId]);
}
// ============================================
// GET SINGLE CONVERSATION
// ============================================
async function getConversationById(conversationId, userId) {
    const result = await db_conn_1.default.query(`SELECT
      c.id,
      c.created_at,
      c.updated_at,
      cs.nickname,

      (
        SELECT json_agg(
          json_build_object(
            'id', u.id,
            'username', u.username,
            'displayName', u.displayName,
            'createdAt', u.createdat
          )
          ORDER BY u.id
        )
        FROM conversation_participants cp
        JOIN users u
          ON cp.user_id = u.id
        WHERE cp.conversation_id = c.id
      ) AS participants,

      -- Current user's unread count
      cp.unread_count AS unread_count,

      COALESCE(cs.is_muted, false) AS is_muted,
      COALESCE(cs.is_pinned, false) AS is_pinned,
      COALESCE(cs.is_archived, false) AS is_archived

    FROM conversations c

    -- Get the current user's participant state
    JOIN conversation_participants cp
      ON c.id = cp.conversation_id
      AND cp.user_id = $2

    LEFT JOIN conversation_settings cs
      ON c.id = cs.conversation_id
      AND cs.user_id = $2

    WHERE c.id = $1

    GROUP BY
      c.id,
      cp.unread_count,
      cs.is_muted,
      cs.is_pinned,
      cs.is_archived,
      cs.nickname`, [conversationId, userId]);
    if (result.rows.length === 0) {
        return null;
    }
    const row = result.rows[0];
    return {
        id: row.id,
        participants: row.participants || [],
        nickname: row.nickname || undefined,
        settings: {
            isMuted: row.is_muted,
            isPinned: row.is_pinned,
            isArchived: row.is_archived,
        },
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        lastMessage: undefined,
        lastMessageTime: undefined,
        unreadCount: parseInt(row.unread_count) || 0,
    };
}
// ============================================
// GET CONVERSATION WITH MESSAGES
// ============================================
async function getConversationWithMessages(conversationId, userId, limit = 50) {
    const conversation = await getConversationById(conversationId, userId);
    if (!conversation) {
        return {
            conversation: null,
            messages: [],
        };
    }
    const messages = await getMessages(conversationId, limit);
    return {
        conversation,
        messages,
    };
}
// ============================================
// VERIFY USER IS A PARTICIPANT
// ============================================
async function isConversationParticipant(conversationId, userId) {
    const result = await db_conn_1.default.query(`SELECT 1
     FROM conversation_participants
     WHERE conversation_id = $1
       AND user_id = $2`, [conversationId, userId]);
    return result.rows.length > 0;
}
