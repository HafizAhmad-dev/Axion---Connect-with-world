import { Router } from "express";
import { getUserById, searchUsers } from "../controllers/users.controller";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get('/search',authMiddleware,searchUsers);
router.get('/:id', getUserById);

export default router