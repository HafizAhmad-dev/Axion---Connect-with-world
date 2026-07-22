import pool from "../db.conn";

//registration module
export async function createUser(
  username: string,
  email: string,
  password: string,
  displayName: string = username,
): Promise<{
  id: string;
  username: string;
  displayName: string;
  email: string;
  createdAt: string;
}> {
  const query =
    "INSERT INTO users (username, displayName, email, password) VALUES ($1, $2, $3, $4) RETURNING id, username,displayName, email, createdAt";
  const values = [username, displayName, email, password];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}


// =========================   SIGN MODULE =========================
export async function SignModule(identifier:string):Promise<{id:string,username:string,displayname:string,email:string,password:string}>{
  const query = `SELECT username, displayName, email, id, password FROM users WHERE email = $1 OR username = $1`
  const value = [identifier];

  try {
    const result = await pool.query(query,value);
    return result.rows[0]
  } catch (error) {
    console.log(error);
    throw error
  }
}




// verify user module
export async function verifyUserMODULE(
  id: string,
)
: Promise<{
  id: string;
  username: string;
  displayName: string;
  email: string;
  createdAt: string;
} | null> {
  const query =
    "SELECT id, username, displayName, email, createdAt FROM users WHERE id = $1 ";
  const value = [id];

  try {
    const result = await pool.query(query, value);
    if (result.rows.length === 0) {
      return null; // ← Add this! User not found in database
    }

    return result.rows[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
}
