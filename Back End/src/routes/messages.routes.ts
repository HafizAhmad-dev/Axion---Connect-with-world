import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { sendNewMessage } from "../controllers/messages.controller.js";
import { getConversationMessages } from "../controllers/conversation.controller.js";

const router = Router();

router.post('/:conversationId',authMiddleware,sendNewMessage);
router.get('/',authMiddleware,getConversationMessages);

export default router