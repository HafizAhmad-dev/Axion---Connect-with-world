"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.declineRequest = exports.acceptRequest = exports.getReqs = exports.sendReq = void 0;
const request_model_js_1 = require("../../database/models/request.model.js");
const friendship_model_js_1 = require("../../database/models/friendship.model.js");
// ================ SEND REQUEST =========================
const sendReq = async (req, res) => {
    const { from, to } = req.body ?? {};
    if (typeof from !== "string" || typeof to !== "string") {
        return res.status(400).json({ text: "Invalid data type" });
    }
    const fromUserId = from.trim();
    const toUserId = to.trim();
    if (!fromUserId || !toUserId) {
        return res.status(400).json({ text: "from and to required" });
    }
    if (fromUserId === toUserId) {
        return res.status(400).json({ text: "Cannot send request to yourself" });
    }
    try {
        const newRequest = await (0, request_model_js_1.createRequest)(fromUserId, toUserId);
        return res.status(201).json({
            success: true,
            message: "Friend request sent",
            data: newRequest
        });
    }
    catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({
                success: false,
                text: "Friend request already sent"
            });
        }
        console.error("Error sending friend request:", error);
        return res.status(500).json({
            success: false,
            text: "Failed to send friend request"
        });
    }
};
exports.sendReq = sendReq;
// ================ GET REQUESTS =========================
const getReqs = async (req, res) => {
    const user = req.user;
    if (!user || !user.id) {
        return res.status(401).json({
            success: false,
            text: "Unauthorized: No user session found"
        });
    }
    try {
        const userReqs = (await (0, request_model_js_1.fetchRequests)(user.id)).rows;
        if (!userReqs || userReqs.length === 0) {
            return res.status(200).json({
                success: true,
                reqs: [],
                text: "No friend requests found"
            });
        }
        return res.status(200).json({
            success: true,
            reqs: userReqs
        });
    }
    catch (error) {
        console.error("Error in getReqs:", error);
        return res.status(500).json({
            success: false,
            text: "Internal server error while fetching requests"
        });
    }
};
exports.getReqs = getReqs;
// ================ ACCEPT REQUEST =========================
const acceptRequest = async (req, res) => {
    const { requestId } = req.body ?? {};
    const currentUserId = req.user?.id;
    // Authentication check
    if (!currentUserId) {
        return res.status(401).json({
            success: false,
            error: "Unauthorized",
        });
    }
    // Request ID validation
    if (typeof requestId !== "string" || !requestId.trim()) {
        return res.status(400).json({
            success: false,
            error: "Request ID is required",
        });
    }
    try {
        const result = await (0, friendship_model_js_1.acceptFriendRequest)(requestId.trim(), currentUserId);
        return res.status(200).json({
            success: true,
            message: "Friend request accepted",
            data: result,
        });
    }
    catch (error) {
        // Expected application errors
        if (error instanceof Error && "code" in error) {
            const code = error.code;
            if (code === "NOT_FOUND") {
                return res.status(404).json({
                    success: false,
                    error: error.message,
                });
            }
            if (code === "UNAUTHORIZED") {
                return res.status(403).json({
                    success: false,
                    error: error.message,
                });
            }
            if (code === "CONFLICT") {
                return res.status(409).json({
                    success: false,
                    error: error.message,
                });
            }
        }
        // Unexpected server error
        console.error("Accept request error:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to accept friend request",
        });
    }
};
exports.acceptRequest = acceptRequest;
// ================ DECLINE REQUEST =========================
const declineRequest = async (req, res) => {
    const { requestId } = req.body;
    const currentUserId = req.user?.id;
    if (!requestId) {
        return res.status(400).json({ error: 'Request ID is required' });
    }
    try {
        // Make sure the request exists and belongs to current user
        const deleted = await (0, request_model_js_1.deleteRequest)(requestId, currentUserId);
        if (!deleted) {
            return res.status(404).json({ error: 'Request not found or already processed' });
        }
        return res.status(200).json({
            success: true,
            message: 'Friend request declined'
        });
    }
    catch (error) {
        console.error('Decline request error:', error);
        return res.status(500).json({ error: 'Failed to decline friend request' });
    }
};
exports.declineRequest = declineRequest;
