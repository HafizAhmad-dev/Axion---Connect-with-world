import pool from "../db.conn";

interface Users {
  id: string;
  username: string;
  displayName: string;
  createdAt: string;
  status: 'friend' | 'none' | 'pending_sent' | 'pending_received';
}

export  async function searchUsersMODEL(
  query: string,
  userId: string,
): Promise<Users[]> {
  const dbquery = `
    SELECT 
      u.id, 
      u.username, 
      u.displayname, 
      u.createdAt,
      CASE 
        WHEN f.id IS NOT NULL THEN 'friend'
        WHEN r.id IS NULL THEN 'none'
        WHEN r.from_user_id = $2 THEN 'pending_sent'
        WHEN r.to_user_id = $2 THEN 'pending_received'
      END AS status
    FROM users u 
    LEFT JOIN friendships f ON 
      (f.user_id = $2 AND f.friend_id = u.id) OR 
      (f.user_id = u.id AND f.friend_id = $2)
    LEFT JOIN friendRequests r ON 
      (r.from_user_id = $2 AND r.to_user_id = u.id) OR 
      (r.from_user_id = u.id AND r.to_user_id = $2)
    WHERE u.username ILIKE $1 AND u.id != $2
    LIMIT 5
  `;
  const values = [`%${query}%`, userId];

  try {
    const result = await pool.query(dbquery, values);
    return result.rows;
  } catch (error) {
    console.error("Search users error:", error);
    throw error;
  }
}


export async function getUserByIdModel(id: string) {
  try {
    const query = `
      SELECT 
        id, 
        username, 
        displayName, 
        email, 
        createdat as "createdAt"
      FROM users 
      WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw new Error('Failed to fetch user');
  }
}