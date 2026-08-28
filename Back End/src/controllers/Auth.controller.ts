import type { Request, Response } from "express";
import { handleValidation } from "../utils/handleValidatin.js";
import bcrypt from "bcrypt";
import { signToken } from "../utils/jwtToken.hook.js";
import { createUser, SignModule, verifyUserMODULE } from "../../database/models/userAuth.model.js";
const saltRounds = Number(process.env.SALT_ROUNDS) || 10;
const JWT_SECRET = process.env.JWT_SECRET;

//for registering the user
export const registerUser = async (req: Request, res: Response) => {
  if (handleValidation(req, res)) return;

  const { email, username, password } = req.body;

  const hash = await bcrypt.hash(password, saltRounds);

  try {
    const newUser = await createUser(username, email, hash);

    const token = signToken({ userId: newUser.id });

    return res.status(201).json({
      message: "User registered successfully",
      User:newUser,
      token,
    });
  } catch (error: any) {
    console.error("Registration error:", error);

    // Handle database duplicate key error
    if (error.code === "23505") {
      // Check which constraint was violated
      if (error.constraint?.includes("username")) {
        return res.status(409).json({
          code: error.code,
          message: "Username already in use",
          errors: { username: "Username already in use" },
        });
      }
      if (error.constraint?.includes("email")) {
        return res.status(409).json({
          code: error.code,
          message: "Email already in use",
          errors: { email: "Email already in use" },
        });
      }
    }

    return res.status(500).json({
      code: error.code || "INTERNAL_SERVER_ERROR",
      message: "Registration failed",
      error: error.message,
    });
  }
};

//for llogin the user
export const loginUser = async (req: Request, res: Response) => {
  // Validate request
  if (handleValidation(req, res)) return;

  const { username, email, password } = req.body;
  const identifier = username || email
  // Missing credentials
  if (!identifier || !password) {
    return res.status(400).json({
      success: false,
      message: "Username/email and password are required",
    });
  }

  // Find user by username or email
  const user = await SignModule(identifier);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  // Check password
  const isCorrectPass = await bcrypt.compare(password, user.password);
  if (!isCorrectPass) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }


  const token = signToken({ userId: user.id });

  // Success
  return res.status(200).json({
    success: true,
    message: "Login successful",
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    token,
  });
};

//for verifying the token and returning text(on order)
export  const verifyUser = async (req: Request, res: Response) => {
  const userFromToken = (req as any).user;
  if (!userFromToken) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }


  return res.status(200).json({
    success: true,
    user: userFromToken,
  });
};
