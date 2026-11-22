import { Router } from "express";
import { getImageKitAuth } from "../controllers/imagekit.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/auth", authMiddleware, getImageKitAuth);

export default router;