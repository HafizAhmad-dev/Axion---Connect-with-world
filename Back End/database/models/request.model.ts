import pool from "../db.conn";

export const createRequest = async (fromUserId: string, toUserId: string) => {
  const query = `
    INSERT INTO friendRequests (from_user_id, to_user_id, status)
    VALUES ($1, $2, 'pending')
    RETURNING id, from_user_id, to_user_id, status, created_at, updated_at
  `;
  const values = [fromUserId, toUserId];
  try {
    const response = await pool.query(query, values);
    return response.rows[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const fetchRequests = async (userId: string) => {
  const query = `SELECT 
  u.username, 
  u.displayname, 
  u.createdat, 
  r.created_at,
  r.id,
  CASE 
    WHEN r.from_user_id = $1 THEN 'sent'
    ELSE 'received'
  END as request_type
FROM friendRequests r
JOIN users u ON (
  (r.from_user_id = $1 AND u.id = r.to_user_id) OR
  (r.to_user_id = $1 AND u.id = r.from_user_id)
)
WHERE r.from_user_id = $1 OR r.to_user_id = $1
  `;
  const values = [userId];
  try {
    const response = pool.query(query, values);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export async function deleteRequest(requestId: string, currentUserId: string) {
  const result = await pool.query(
    `DELETE FROM friendRequests 
     WHERE id = $1 AND to_user_id = $2 
     RETURNING id`,
    [requestId, currentUserId]
  );
  
  return result.rows.length > 0;
}