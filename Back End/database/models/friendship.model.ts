import pool from "../db.conn";

interface AcceptRequestResult {
  success: boolean;
  friendshipId: string;
  friendId: string;
}

export async function acceptFriendRequest(requestId: string, currentUserId: string): Promise<AcceptRequestResult> {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // 1. Get the request
    const requestResult = await client.query(
      `SELECT from_user_id, to_user_id FROM friendRequests WHERE id = $1`,
      [requestId]
    );
    
    if (requestResult.rows.length === 0) {
      throw new Error('Friend request not found');
    }
    
    const { from_user_id, to_user_id } = requestResult.rows[0];
    
    // 2. Verify current user is the recipient
    if (to_user_id !== currentUserId) {
      throw new Error('You cannot accept this request');
    }
    
    // 3. Delete the request
    await client.query(
      `DELETE FROM friendRequests WHERE id = $1`,
      [requestId]
    );
    
    // 4. Create friendship rows (both directions)
    await client.query(
      `INSERT INTO friendships (user_id, friend_id) VALUES ($1, $2), ($2, $1)`,
      [from_user_id, to_user_id]
    );
    
    await client.query('COMMIT');
    
    return {
      success: true,
      friendshipId: from_user_id,
      friendId: from_user_id
    };
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error accepting friend request:', error);
    throw error;
    
  } finally {
    client.release();
  }
}