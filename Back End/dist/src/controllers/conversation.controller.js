"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNickname = exports.deleteConversationForUser = exports.updateConversationSettingsController = exports.markMessagesAsReadController = exports.sendNewMessage = exports.getConversationMessages = exports.getUserConversationsList = exports.getConversationWithFriend = void 0;
const conversation_model_1 = require("../../database/models/conversation.model");
// ============ Get or create conversation with a friend ============
const getConversationWithFriend = async (req, res) => {
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
        const conversation = await (0, conversation_model_1.getOrCreateConversation)(currentUserId, friendId);
        res.json({ success: true, conversation });
    }
    catch (error) {
        console.error("Error getting conversation:", error);
        res.status(500).json({ error: "Failed to get conversation" });
    }
};
exports.getConversationWithFriend = getConversationWithFriend;
// ============ Get all conversations for current user ============
const getUserConversationsList = async (req, res) => {
    const currentUserId = req.user.id;
    try {
        const conversations = await (0, conversation_model_1.getUserConversations)(currentUserId);
        res.json({ success: true, conversations });
    }
    catch (error) {
        console.error("Error getting conversations:", error);
        res.status(500).json({ error: "Failed to get conversations" });
    }
};
exports.getUserConversationsList = getUserConversationsList;
// ============ Get messages for a conversation ============
const getConversationMessages = async (req, res) => {
    const currentUserId = req.user.id;
    const { conversationId } = req.params;
    console.log(conversationId, typeof conversationId);
    if (typeof conversationId !== "string") {
        return res
            .status(400)
            .json({ message: "Invalid or missing conversationId!" });
    }
    if (!conversationId) {
        return res.status(400).json({ error: "Conversation ID is required" });
    }
    let limit = req.query.limit ? parseInt(req.query.limit) : 50;
    limit = Math.min(Math.max(limit, 1), 100); // Bounds: 1-100
    try {
        const messages = await (0, conversation_model_1.getMessages)(conversationId, limit);
        // Mark messages as read in background
        (0, conversation_model_1.markConversationAsRead)(conversationId, currentUserId).catch(console.error);
        res.json({ success: true, messages });
    }
    catch (error) {
        console.error("Error getting messages:", error);
        res.status(500).json({ error: "Failed to get messages" });
    }
};
exports.getConversationMessages = getConversationMessages;
// ============ Send a new message ============
const sendNewMessage = async (req, res) => {
    const currentUserId = req.user.id;
    const { conversationId, content } = req.body;
    if (!conversationId) {
        return res.status(400).json({ error: "Conversation ID is required" });
    }
    if (!content || content.trim() === "") {
        return res.status(400).json({ error: "Message content is required" });
    }
    try {
        const message = await (0, conversation_model_1.sendMessage)(conversationId, currentUserId, content.trim());
        res.json({ success: true, message });
    }
    catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ error: "Failed to send message" });
    }
};
exports.sendNewMessage = sendNewMessage;
// ============ Mark messages as read ============
const markMessagesAsReadController = async (req, res) => {
    const currentUserId = req.user.id;
    const { conversationId } = req.body;
    if (!conversationId) {
        return res.status(400).json({ error: "Conversation ID is required" });
    }
    try {
        await (0, conversation_model_1.markConversationAsRead)(conversationId, currentUserId);
        res.json({ success: true });
    }
    catch (error) {
        console.error("Error marking conversation as read:", error);
        res.status(500).json({ error: "Failed to mark conversation as read" });
    }
};
exports.markMessagesAsReadController = markMessagesAsReadController;
// ============ Update conversation settings (mute, pin, archive) ============
const updateConversationSettingsController = async (req, res) => {
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
        await (0, conversation_model_1.updateConversationSettings)(conversationId, currentUserId, {
            isMuted,
            isPinned,
            isArchived,
        });
        res.json({ success: true });
    }
    catch (error) {
        console.error("Error updating conversation settings:", error);
        res.status(500).json({ error: "Failed to update settings" });
    }
};
exports.updateConversationSettingsController = updateConversationSettingsController;
// ============ Delete conversation (hide for user) ============
const deleteConversationForUser = async (req, res) => {
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
        await (0, conversation_model_1.updateConversationSettings)(conversationId, currentUserId, {
            isArchived: true,
        });
        res.json({ success: true, message: "Conversation archived" });
    }
    catch (error) {
        console.error("Error deleting conversation:", error);
        res.status(500).json({ error: "Failed to delete conversation" });
    }
};
exports.deleteConversationForUser = deleteConversationForUser;
// Update conversation nickname (per-user)
const updateNickname = async (req, res) => {
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
        await (0, conversation_model_1.updateConversationNickname)(conversationId, userId, nickname.trim());
        res.json({ success: true, nickname: nickname.trim() });
    }
    catch (error) {
        console.error("Error updating nickname:", error);
        res.status(500).json({ error: "Failed to update nickname" });
    }
};
exports.updateNickname = updateNickname;
