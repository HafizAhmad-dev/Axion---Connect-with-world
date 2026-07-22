import { Router } from "express";
import { getFriends } from "../controllers/Friends.controller.js";
const router = Router();

router.get("/search", getFriends);

export default router;
