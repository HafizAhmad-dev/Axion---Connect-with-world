import { Request, Response, NextFunction } from "express";
import imagekit from "../config/imagekit.config.js";

export const getImageKitAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authenticationParameters =
      imagekit.helper.getAuthenticationParameters();

    res.status(200).json({
      ...authenticationParameters,
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    });
  } catch (error) {
    next(error);
  }
};