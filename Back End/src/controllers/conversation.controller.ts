import { Request, Response } from "express";
import {
  getOrCreateConversation,
  getUserConversations,
  getMessages,
  sendMessage,
  markConversationAsRead,
  updateConversationSettings,
  updateConversationNickname,
} from "../../database/models/conversation.model";

// ============ Get or create conversation with a friend ============
export const getConversationWithFriend = async (
  req: Request,
  res: Response,
) => {
  const currentUserId = req.user.id;
  const { friendId } = req.params;

  if (typeof friendId != "string") {
    return res.status(400).json({ message: "Invalid or missing friendId!" });
  }

  if (!friendId) {
    return res.status(400).json({ error: "Friend ID is required" });
  }

  if (currentUserId === friendId) {
    return res
      .status(400)
      .json({ error: "Cannot start conversation with yourself" });
  }

  try {
    const conversation = await getOrCreateConversation(currentUserId, friendId);
    res.json({ success: true, conversation });
  } catch (error) {
    console.error("Error getting conversation:", error);
    res.status(500).json({ error: "Failed to get conversation" });
  }
};

// ============ Get all conversations for current user ============
export const getUserConversationsList = async (req: Request, res: Response) => {
  const currentUserId = req.user.id;

  try {
    const conversations = await getUserConversations(currentUserId);
    res.json({ success: true, conversations });
  } catch (error) {
    console.error("Error getting conversations:", error);
    res.status(500).json({ error: "Failed to get conversations" });
  }
};

// ============ Get messages for a conversation ============
export const getConversationMessages = async (req: Request, res: Response) => {
  const currentUserId = req.user.id;
  const { conversationId } = req.params;
  console.log(conversationId,typeof conversationId)
  if (typeof conversationId !== "string") {
    return res
      .status(400)
      .json({ message: "Invalid or missing conversationId!" });
  }

  if (!conversationId) {
    return res.status(400).json({ error: "Conversation ID is required" });
  }

  let limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
  limit = Math.min(Math.max(limit, 1), 100); // Bounds: 1-100

  try {
    const messages = await getMessages(conversationId, limit);

    // Mark messages as read in background
    markConversationAsRead(conversationId, currentUserId).catch(console.error);

    res.json({ success: true, messages });
  } catch (error) {
    console.error("Error getting messages:", error);
    res.status(500).json({ error: "Failed to get messages" });
  }
};

// ============ Send a new message ============
export const sendNewMessage = async (req: Request, res: Response) => {
  const currentUserId = req.user.id;
  const { conversationId, content } = req.body;

  if (!conversationId) {
    return res.status(400).json({ error: "Conversation ID is required" });
  }

  if (!content || content.trim() === "") {
    return res.status(400).json({ error: "Message content is required" });
  }

  try {
    const message = await sendMessage(
      conversationId,
      currentUserId,
      content.trim(),
    );
    res.json({ success: true, message });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
};

// ============ Mark messages as read ============
export const markMessagesAsReadController = async (
  req: Request,
  res: Response,
) => {
  const currentUserId = req.user.id;
  const { conversationId } = req.body;

  if (!conversationId) {
    return res.status(400).json({ error: "Conversation ID is required" });
  }

  try {
    await markConversationAsRead(conversationId, currentUserId);
    res.json({ success: true });
  } catch (error) {
    console.error("Error marking conversation as read:", error);
    res.status(500).json({ error: "Failed to mark conversation as read" });
  }
};

// ============ Update conversation settings (mute, pin, archive) ============
export const updateConversationSettingsController = async (
  req: Request,
  res: Response,
) => {
  const currentUserId = req.user.id;
  const { conversationId } = req.params;
  const { isMuted, isPinned, isArchived } = req.body;

  if (typeof conversationId != "string") {
    return res
      .status(400)
      .json({ message: "Invalid or missing conversationId!" });
  }
  if (!conversationId) {
    return res.status(400).json({ error: "Conversation ID is required" });
  }

  try {
    await updateConversationSettings(conversationId, currentUserId, {
      isMuted,
      isPinned,
      isArchived,
    });
    res.json({ success: true });
  } catch (error) {
    console.error("Error updating conversation settings:", error);
    res.status(500).json({ error: "Failed to update settings" });
  }
};

// ============ Delete conversation (hide for user) ============
export const deleteConversationForUser = async (
  req: Request,
  res: Response,
) => {
  const currentUserId = req.user.id;
  const { conversationId } = req.params;

  if (typeof conversationId != "string") {
    return res
      .status(400)
      .json({ message: "Invalid or missing conversationId!" });
  }

  if (!conversationId) {
    return res.status(400).json({ error: "Conversation ID is required" });
  }

  try {
    await updateConversationSettings(conversationId, currentUserId, {
      isArchived: true,
    });
    res.json({ success: true, message: "Conversation archived" });
  } catch (error) {
    console.error("Error deleting conversation:", error);
    res.status(500).json({ error: "Failed to delete conversation" });
  }
};

// Update conversation nickname (per-user)
export const updateNickname = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { conversationId } = req.params;
  const { nickname } = req.body;

  if (typeof conversationId != "string") {
    return res
      .status(400)
      .json({ message: "Invalid or missing conversation Id" });
  }
  if (!nickname || nickname.trim() === "") {
    return res.status(400).json({ error: "Nickname is required" });
  }

  if (nickname.length > 100) {
    return res
      .status(400)
      .json({ error: "Nickname must be less than 100 characters" });
  }

  try {
    await updateConversationNickname(conversationId, userId, nickname.trim());
    res.json({ success: true, nickname: nickname.trim() });
  } catch (error) {
    console.error("Error updating nickname:", error);
    res.status(500).json({ error: "Failed to update nickname" });
  }
};
