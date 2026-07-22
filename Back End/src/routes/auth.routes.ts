import { Router } from "express";
import { loginUser, registerUser, verifyUser } from "../controllers/Auth.controller.js";
import { loginValidator, signupValidator } from "../validators/auth.validator.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post('/register', signupValidator, registerUser);
router.post('/login', loginValidator, loginUser);
router.get('/me', authMiddleware, verifyUser);

export default router;