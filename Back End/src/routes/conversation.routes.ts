// src/features/conversations/conversation.routes.ts
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  getConversationWithFriend,
  getUserConversationsList,
  getConversationMessages,
  sendNewMessage,
  markMessagesAsReadController,
  updateConversationSettingsController,
  deleteConversationForUser,
  updateNickname
} from "../controllers/conversation.controller";

const router = Router();

// All conversation routes require authentication
router.use(authMiddleware);

// Get all conversations for current user
router.get("/", getUserConversationsList);

// Get or create conversation with a specific friend
router.get("/with/:friendId", getConversationWithFriend);

// Get messages for a conversation
router.get("/:conversationId/messages", getConversationMessages);

// Send a new message
router.post("/messages", sendNewMessage);

// Mark messages as read
router.put("/messages/read", markMessagesAsReadController);

// Update conversation settings
router.put("/:conversationId/settings", updateConversationSettingsController);

// Archive/delete conversation
router.delete("/:conversationId", deleteConversationForUser);

// Update nickname for a conversation (per-user)
router.put("/:conversationId/nickname", updateNickname);
export default router;