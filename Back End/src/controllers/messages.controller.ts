// src/controllers/message.controller.ts
import { Request, Response } from "express";
import {
  sendMessage,
  getMessages,
  markMessagesAsRead,
} from "../../database/models/messages.model";
import { getConversationById } from "../../database/models/conversation.model";
import { io } from "../socket/socket";

export const sendNewMessage = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { conversationId, content } = req.body;

  if (!conversationId) {
    return res.status(400).json({ error: "Conversation ID is required" });
  }

  if (!content || content.trim() === "") {
    return res.status(400).json({ error: "Message content is required" });
  }

  try {
    // Verify user is a participant in the conversation
    const conversation = await getConversationById(conversationId, userId);
    if (!conversation) {
      return res.status(403).json({ error: "Access denied" });
    }

    const message = await sendMessage(conversationId, userId, content.trim());

    const roomName = `conversation:${conversationId}`;

    console.log("Room members:", io.sockets.adapter.rooms.get(roomName));
    const room = io.sockets.adapter.rooms.get(roomName);


    // Check which sockets currently have this conversation open
    room?.forEach((socketId) => {
      const socket = io.sockets.sockets.get(socketId);

      if (!socket) return;

      if (socket.data.activeConversation === conversationId) {
        console.log(
          `User ${socket.data.userId} has conversation ${conversationId} open`,
        );

        // Mark/read handling will go here
      } else {
        console.log(
          `User ${socket.data.userId} does NOT have conversation ${conversationId} open`,
        );

        // Increase unread count / send unread notification here
      }
    });

    io.to(`conversation:${conversationId}`).emit("new_message", {
      message,
      conversationId,
    });

    res.status(201).json({ success: true, message });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
};

export const getConversationMessages = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { conversationId } = req.params;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
  const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;

  if (typeof conversationId !== "string") {
    return res
      .status(400)
      .json({ message: "Invalid or Missing conversation Id" });
  }
  if (!conversationId) {
    return res.status(400).json({ error: "Conversation ID is required" });
  }

  try {
    // Verify user is a participant
    const conversation = await getConversationById(conversationId, userId);
    if (!conversation) {
      return res.status(403).json({ error: "Access denied" });
    }

    const messages = await getMessages(conversationId, limit, offset);

    // Mark messages as read in background
    markMessagesAsRead(conversationId, userId).catch(console.error);

    res.json({ success: true, messages });
  } catch (error) {
    console.error("Error getting messages:", error);
    res.status(500).json({ error: "Failed to get messages" });
  }
};
