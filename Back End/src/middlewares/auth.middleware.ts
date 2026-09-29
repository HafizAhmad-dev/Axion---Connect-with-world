import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwtToken.hook.js";
import { verifyUserMODULE } from "../../database/models/userAuth.model.js";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }

  const token = authHeader.split(" ")[1];

  let decoded: { userId: string };

  try {
    decoded = verifyToken(token) as { userId: string };
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }

  try {
    const user = await verifyUserMODULE(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = {
      id: user.id,
      displayName: user.displayName,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    next();
  } catch (err) {
    console.error("Auth middleware database error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};