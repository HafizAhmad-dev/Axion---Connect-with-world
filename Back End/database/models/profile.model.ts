import  pool  from "../db.conn";

export const getUserProfileMODEL = async (userId: string) => {
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

  const result = await pool.query(query, [userId]);

  return result.rows[0] ?? null;
};