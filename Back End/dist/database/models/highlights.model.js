"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserActiveHighlightsModel = exports.retreiveHighlightsModel = exports.getActiveHighlightModel = exports.highlightViewedModel = exports.createHighlightModel = void 0;
const db_conn_js_1 = __importDefault(require("../../database/db.conn.js"));
// Create a Highlight
const createHighlightModel = async (userId, highlightData) => {
    const query = `
    INSERT INTO highlights (
      user_id,
      type,
      media_url,
      caption,
      background,
      expires_at
    )
    VALUES (
      $1,
      $2,
      $3,
      $4,
      $5,
      NOW() + INTERVAL '24 hours'
    )
    RETURNING
      id,
      user_id AS "userId",
      type,
      media_url AS "mediaUrl",
      caption,
      background,
      created_at AS "createdAt",
      expires_at AS "expiresAt";
  `;
    const values = [
        userId,
        highlightData.type,
        highlightData.mediaUrl ?? null,
        highlightData.caption ?? null,
        highlightData.background ?? null,
    ];
    try {
        const result = await db_conn_js_1.default.query(query, values);
        return result.rows[0];
    }
    catch (error) {
        console.error("Error creating highlight:", error);
        throw error;
    }
};
exports.createHighlightModel = createHighlightModel;
//fucntion for handling the views of highlights
// Record a Highlight view
const highlightViewedModel = async (highlightId, viewerId) => {
    const query = `
    INSERT INTO highlight_views (
      highlight_id,
      viewer_id
    )
    SELECT
      h.id,
      $2
    FROM highlights h

    JOIN friendships fs
      ON fs.user_id = $2
      AND fs.friend_id = h.user_id

    WHERE h.id = $1
      AND h.expires_at > NOW()

    ON CONFLICT (highlight_id, viewer_id)
    DO NOTHING

    RETURNING
      highlight_id,
      viewer_id,
      viewed_at;
  `;
    try {
        const result = await db_conn_js_1.default.query(query, [
            highlightId,
            viewerId,
        ]);
        return result.rows[0] ?? null;
    }
    catch (error) {
        console.error("Error recording Highlight view:", error);
        throw error;
    }
};
exports.highlightViewedModel = highlightViewedModel;
//get the highlight
const getActiveHighlightModel = async (highlightId) => {
    const query = `
    SELECT
      id,
      user_id AS "userId",
      type,
      media_url AS "mediaUrl",
      background,
      caption,
      created_at AS "createdAt",
      expires_at AS "expiresAt"
    FROM highlights
    WHERE id = $1
      AND expires_at > NOW()
  `;
    const result = await db_conn_js_1.default.query(query, [highlightId]);
    return result.rows[0] ?? null;
};
exports.getActiveHighlightModel = getActiveHighlightModel;
// Function for fetching friends highlights from DB
const retreiveHighlightsModel = async (userId) => {
    const query = `SELECT fs.user_id, fs.friend_id, u.username, u.displayName, u.id, h.id as highlight_id, h.type, h.media_url, h.background , h.caption, h.created_at, h.expires_at, hv.viewer_id IS NOT NULL as viewed FROM friendships fs 
 JOIN users u
ON u.id = fs.friend_id

 JOIN highlights h
ON h.user_id = u.id AND h.expires_at > NOW()

LEFT JOIN highlight_views hv
ON hv.highlight_id = h.id AND hv.viewer_id = fs.user_id

WHERE FS.user_id = $1;`;
    const value = [userId];
    try {
        const result = await db_conn_js_1.default.query(query, value);
        console.log("vaalues", value);
        return result.rows;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
};
exports.retreiveHighlightsModel = retreiveHighlightsModel;
// database/models/highlights.model.ts
///get user active highligts
const getUserActiveHighlightsModel = async (userId) => {
    const query = `
    SELECT
      id,
      user_id AS "userId",
      type,
      media_url AS "mediaUrl",
      background,
      caption,
      created_at AS "createdAt",
      expires_at AS "expiresAt"
    FROM highlights
    WHERE user_id = $1
      AND expires_at > NOW()
    ORDER BY created_at ASC;
  `;
    try {
        const result = await db_conn_js_1.default.query(query, [userId]);
        return result.rows;
    }
    catch (error) {
        console.error("Error retrieving user's highlights:", error);
        throw error;
    }
};
exports.getUserActiveHighlightsModel = getUserActiveHighlightsModel;
