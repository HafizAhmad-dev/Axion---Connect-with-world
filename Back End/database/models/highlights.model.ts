import type { HighlightInput, HighlightRow } from "../../src/types/Highlights.type";
import pool from "../../database/db.conn.js";

// Create a Highlight
export const createHighlightModel = async (
  userId: string,
  highlightData: HighlightInput,
) => {
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
    const result = await pool.query(query, values);

    return result.rows[0];
  } catch (error) {
    console.error("Error creating highlight:", error);
    throw error;
  }
};

//fucntion for handling the views of highlights
// Record a Highlight view
export const highlightViewedModel = async (
  highlightId: string,
  viewerId: string,
) => {
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
    const result = await pool.query(query, [
      highlightId,
      viewerId,
    ]);

    return result.rows[0] ?? null;

  } catch (error) {
    console.error("Error recording Highlight view:", error);
    throw error;
  }
};

//get the highlight
export const getActiveHighlightModel = async (highlightId: string) => {
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

  const result = await pool.query(query, [highlightId]);

  return result.rows[0] ?? null;
};

// Function for fetching friends highlights from DB
export const retreiveHighlightsModel = async (userId: string):Promise<HighlightRow[]> => {
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
    const result = await pool.query(query, value);
    console.log("vaalues",value)
    return result.rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
};


// database/models/highlights.model.ts

///get user active highligts
export const getUserActiveHighlightsModel = async (
  userId: string
) => {
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
    const result = await pool.query(query, [userId]);

    return result.rows;
  } catch (error) {
    console.error("Error retrieving user's highlights:", error);
    throw error;
  }
};