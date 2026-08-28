import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwtToken.hook.js";
import { verifyUserMODULE } from "../../database/models/userAuth.model.js";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token) as { userId: string };
    const userId = decoded.userId;

    const user = await verifyUserMODULE(userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // IMPORTANT: attach user to request
    req.user = {
      id: user.id,
      displayName:user.displayName,
      username:user.username,
      email:user.email
    };

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};