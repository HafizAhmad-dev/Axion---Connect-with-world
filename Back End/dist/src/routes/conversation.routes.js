"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/features/conversations/conversation.routes.ts
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const conversation_controller_1 = require("../controllers/conversation.controller");
const router = (0, express_1.Router)();
// All conversation routes require authentication
router.use(auth_middleware_1.authMiddleware);
// Get all conversations for current user
router.get("/", conversation_controller_1.getUserConversationsList);
// Get or create conversation with a specific friend
router.get("/with/:friendId", conversation_controller_1.getConversationWithFriend);
// Get messages for a conversation
router.get("/:conversationId/messages", conversation_controller_1.getConversationMessages);
// Send a new message
router.post("/messages", conversation_controller_1.sendNewMessage);
// Mark messages as read
router.put("/messages/read", conversation_controller_1.markMessagesAsReadController);
// Update conversation settings
router.put("/:conversationId/settings", conversation_controller_1.updateConversationSettingsController);
// Archive/delete conversation
router.delete("/:conversationId", conversation_controller_1.deleteConversationForUser);
// Update nickname for a conversation (per-user)
router.put("/:conversationId/nickname", conversation_controller_1.updateNickname);
exports.default = router;
