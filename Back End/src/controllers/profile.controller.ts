import type { Request, Response } from "express";
import {
  updateAvatarModel,
  updateUserDisplayNameMODEL,
  updateUsernameMODEL,
  updateUserPasswordMODEL,
  UsernameUpdateError,
} from "../../database/models/userDataUpdate.model";
import { getUserProfileMODEL } from "../../database/models/profile.model";
import { getUserPasswordModel } from "../../database/models/users.model";
import bcrypt from "bcrypt";
const multer = 'multer';

const saltRounds = Number(process.env.SALT_ROUNDS) || 10;
// controller for getting user profile
export const getUserProfile = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const user = await getUserProfileMODEL(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get user profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user profile",
    });
  }
};

//controller for updating user display name
export const updateDisplayName = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { displayName } = req.body ?? {};

  if (typeof displayName !== "string" || !displayName.trim()) {
    return res.status(400).json({
      success: false,
      message: "Display name is required",
    });
  }

  const newDisplayName = displayName.trim();

  if (newDisplayName.length > 10) {
    return res.status(400).json({
      success: false,
      message: "Display name must be 10 characters or less",
    });
  }

  try {
    const updatedUser = await updateUserDisplayNameMODEL(
      userId,
      newDisplayName,
    );

    return res.status(200).json({
      success: true,
      message: "Display name updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update display name error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update display name",
    });
  }
};

//controller for updating user username

export const updateUsername = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const { username } = req.body ?? {};

  if (typeof username !== "string") {
    return res.status(400).json({
      success: false,
      message: "Username must be a string",
    });
  }

  const newUsername = username.trim().toLowerCase();

  if (!newUsername) {
    return res.status(400).json({
      success: false,
      message: "Username is required",
    });
  }

  if (!/^[a-z0-9_]{3,30}$/.test(newUsername)) {
    return res.status(400).json({
      success: false,
      message:
        "Username must be 3–30 characters and contain only lowercase letters, numbers, and underscores",
    });
  }

  if (newUsername === req.user?.username?.toLowerCase()) {
    return res.status(400).json({
      success: false,
      message: "Please enter a different username!",
    });
  }

  try {
    const user = await updateUsernameMODEL(userId, newUsername);

    return res.status(200).json({
      success: true,
      message: "Username updated successfully",
      user,
    });
  } catch (error) {
    if (error instanceof UsernameUpdateError) {
      switch (error.code) {
        case "USER_NOT_FOUND":
          return res.status(404).json({
            success: false,
            message: error.message,
          });

        case "USERNAME_TAKEN":
          return res.status(409).json({
            success: false,
            message: error.message,
          });

        case "USERNAME_CHANGE_COOLDOWN":
          return res.status(429).json({
            success: false,
            message: error.message,
          });

        case "USERNAME_CLAIM_INCONSISTENT":
          console.error("Username claim inconsistency:", error);

          return res.status(500).json({
            success: false,
            message: "Unable to update username",
          });
      }
    }

    console.error("Update username error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update username",
    });
  }
};

//controller for updating user password
export const updatePassword = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { currentPassword, newPassword, confirmPassword } = (req.body ??
    {}) as {
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  };

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const trimmedCurrentPassword = currentPassword?.trim();
  const trimmedNewPassword = newPassword?.trim();
  const trimmedConfirmPassword = confirmPassword?.trim();

  if (
    !trimmedCurrentPassword ||
    !trimmedNewPassword ||
    !trimmedConfirmPassword
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Current password, new password, and confirm password are required",
    });
  }
  if(trimmedCurrentPassword === trimmedNewPassword){
    return res.status(400).json({
      success: false,
      message: "New password cannot be the same as the current password",
    });
  }
  if (trimmedNewPassword.length < 8) {
    return res.status(400).json({
      success: false,
      message: "New password must be at least 8 characters long",
    });
  }

  if (trimmedNewPassword !== trimmedConfirmPassword) {
    return res.status(400).json({
      success: false,
      message: "New password and confirm password do not match",
    });
  }
  try {
    const password = await getUserPasswordModel(userId);

    if (!password) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isCorrectPass = await bcrypt.compare(
      trimmedCurrentPassword,
      password.password,
    );

    if (!isCorrectPass) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const hashedNewPassword = await bcrypt.hash(trimmedNewPassword, saltRounds);

    await updateUserPasswordMODEL(userId, hashedNewPassword);

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Password change failed:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


//controller for updating user profile picture
export const updateProfilePicture = async (
  req: Request,
  res: Response,
) => {
  try {
    const userId = req.user?.id;
    const { avatarUrl, avatarFileId } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (
      typeof avatarUrl !== "string" ||
      typeof avatarFileId !== "string" ||
      !avatarUrl.trim() ||
      !avatarFileId.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Avatar URL and file ID are required",
      });
    }

    // Basic URL validation
    let parsedUrl: URL;

    try {
      parsedUrl = new URL(avatarUrl);
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid avatar URL",
      });
    }

    if (parsedUrl.protocol !== "https:") {
      return res.status(400).json({
        success: false,
        message: "Avatar URL must use HTTPS",
      });
    }

    const updatedUser = await updateAvatarModel({
      userId,
      avatarUrl: parsedUrl.toString(),
      avatarFileId: avatarFileId.trim(),
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update profile picture error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};