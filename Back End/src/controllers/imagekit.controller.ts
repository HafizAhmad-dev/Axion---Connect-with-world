import type { Request, Response } from "express";
import imagekit from "../config/imagekit.js";

export const getImageKitAuth = (
  req: Request,
  res: Response
) => {
  const { token, expire, signature } =
    imagekit.helper.getAuthenticationParameters();

  res.status(200).json({
    token,
    expire,
    signature,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  });
};