import pool from "../db.conn";

type UpdateAvatarInput = {
  userId: string;
  avatarUrl: string;
  avatarFileId: string;
};

type UpdatedAvatar = {
  id: string;
  avatarUrl: string;
  avatarFileId: string;
};


type UsernameUpdateResult = {
  id: string;
  username: string;
  usernameChangedAt: Date;
};

export class UsernameUpdateError extends Error {
  constructor(
    public readonly code:
      | "USER_NOT_FOUND"
      | "USERNAME_TAKEN"
      | "USERNAME_CHANGE_COOLDOWN"
      | "USERNAME_CLAIM_INCONSISTENT",
    message: string,
  ) {
    super(message);
    this.name = "UsernameUpdateError";
  }
}


export const updateUserDisplayNameMODEL = async (
  userId: string,
  displayName: string,
): Promise<any> => {
  const dbquery = `
   UPDATE users 
SET 
displayname = $2,
updatedAt = NOW()
where id = $1;
`;
  const values = [userId, displayName];

  try {
    const result = await pool.query(dbquery, values);
    console.log("User display name updated successfully:", result.rowCount);
    return result.rows;
  } catch (err) {
    console.error("Error updating user display name:", err);
    throw err;
  }
};


export const updateUsernameMODEL = async (
  userId: string,
  newUsername: string,
): Promise<UsernameUpdateResult> => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Lock this user's row to serialize their username changes.
    const userResult = await client.query<{
      id: string;
      username: string;
      username_changed_at: Date | null;
    }>(
      `
        SELECT id, username, username_changed_at
        FROM users
        WHERE id = $1
        FOR UPDATE
      `,
      [userId],
    );

    const user = userResult.rows[0];

    if (!user) {
      throw new UsernameUpdateError(
        "USER_NOT_FOUND",
        "User not found",
      );
    }

    const currentUsername = user.username.toLowerCase();
    const normalizedUsername = newUsername.trim().toLowerCase();

    // No change is necessary if the username is already the same.
    if (currentUsername === normalizedUsername) {
      await client.query("COMMIT");

      return {
        id: user.id,
        username: user.username,
        usernameChangedAt: user.username_changed_at as Date,
      };
    }

    // Remove expired reservations before checking availability.
    await client.query(`
      DELETE FROM username_claims
      WHERE claim_type = 'previous'
        AND expires_at <= NOW()
    `);

    // Enforce a fixed 30-day cooldown.
    if (
      user.username_changed_at &&
      new Date(user.username_changed_at).getTime() >
        Date.now() - 30 * 24 * 60 * 60 * 1000
    ) {
      throw new UsernameUpdateError(
        "USERNAME_CHANGE_COOLDOWN",
        "You can change your username only once every 30 days",
      );
    }

    // Fast availability check. The primary key remains the
    // final protection against concurrent username claims.
    const claimResult = await client.query(
      `
        SELECT user_id
        FROM username_claims
        WHERE username = $1
      `,
      [normalizedUsername],
    );

    if (claimResult.rows.length > 0) {
      throw new UsernameUpdateError(
        "USERNAME_TAKEN",
        "This username is already taken",
      );
    }

    // Reserve the old username for exactly 30 days.
    const previousClaim = await client.query(
      `
        UPDATE username_claims
        SET
          claim_type = 'previous',
          expires_at = NOW() + INTERVAL '30 days'
        WHERE username = $1
          AND user_id = $2
          AND claim_type = 'current'
        RETURNING username
      `,
      [currentUsername, userId],
    );

    if (previousClaim.rowCount !== 1) {
      throw new UsernameUpdateError(
        "USERNAME_CLAIM_INCONSISTENT",
        "Current username claim is missing",
      );
    }

    // Claim the new username.
    await client.query(
      `
        INSERT INTO username_claims (
          username,
          user_id,
          claim_type,
          expires_at
        )
        VALUES ($1, $2, 'current', NULL)
      `,
      [normalizedUsername, userId],
    );

    // Update the user's current username.
    const updatedResult = await client.query<UsernameUpdateResult>(
  `
    UPDATE users
    SET
      previous_username = username,
      previous_username_expires_at = NOW() + INTERVAL '30 days',
      username = $1,
      username_changed_at = NOW(),
      updatedat = NOW()
    WHERE id = $2
    RETURNING
      id,
      username,
      previous_username AS "previousUsername",
      previous_username_expires_at AS "previousUsernameExpiresAt",
      username_changed_at AS "usernameChangedAt"
  `,
  [normalizedUsername, userId],
);

    await client.query("COMMIT");

    return updatedResult.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");

    // Another request may have claimed the username after our
    // availability check. The unique constraint catches that race.
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "23505"
    ) {
      throw new UsernameUpdateError(
        "USERNAME_TAKEN",
        "This username is already taken or reserved",
      );
    }

    throw error;
  } finally {
    client.release();
  }
};


export const updateUserPasswordMODEL = async (
  userId: string,
  hashedPassword: string,
): Promise<any> => {
  const dbquery = `
    UPDATE users
    SET 
      password = $2,
      updatedAt = NOW(),
      password_changed_at = NOW(),
      session_version = session_version + 1
    WHERE id = $1;
  `;
  const values = [userId, hashedPassword];

  try {
    const result = await pool.query(dbquery, values);
    console.log("User password updated successfully:", result.rowCount);
    return result.rows;
  } catch (err) {
    console.error("Error updating user password:", err);
    throw err;
  }
};


export const updateAvatarModel = async ({
  userId,
  avatarUrl,
  avatarFileId,
}: UpdateAvatarInput): Promise<UpdatedAvatar | null> => {
  const result = await pool.query<UpdatedAvatar>(
    `UPDATE users
     SET
       avatar_url = $1,
       avatar_file_id = $2,
       updatedat = NOW()
     WHERE id = $3
     RETURNING
       id,
       avatar_url AS "avatarUrl",
       avatar_file_id AS "avatarFileId"`,
    [avatarUrl, avatarFileId, userId],
  );

  return result.rows[0] ?? null;
};