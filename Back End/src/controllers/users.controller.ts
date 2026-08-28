import type { Request, Response } from "express";

import {getUserByIdModel, searchUsersMODEL} from "../../database/models/users.model.js";

export const searchUsers = async (req: Request, res: Response) => {
  const q = ((req.query.q as string) || "").trim().toLowerCase();
  console.log('usres from req',req.user)
  const userId = req.user.id;

  if (!q) {
    return res.status(400).json({
      success: false,
      message: "Query is missing",
    });
  }

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "userId is missing",
    });
  }

  const users = await searchUsersMODEL(q, userId);

  if(users.length === 0){
    return res.json({
      success:true,
      data:users,
      message:'No Users found'
    })
  };

  return res.json({
    success:true,
    data:users
  })

};

export const getUserById = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (typeof id !== 'string' || !id.trim()) {
    return res.status(400).json({ message: "Invalid or missing user id" });
  }

  try {
    const user = await getUserByIdModel(id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};