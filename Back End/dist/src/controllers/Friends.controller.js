"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFriends = void 0;
const friendship_model_js_1 = require("../../database/models/friendship.model.js");
const getFriends = async (req, res) => {
    try {
        const userId = req.user?.id;
        const query = typeof req.query.q === "string"
            ? req.query.q.trim()
            : "";
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        if (!query) {
            return res.status(400).json({
                success: false,
                message: "Search query is required",
            });
        }
        const friends = await (0, friendship_model_js_1.getFriendsModel)(userId, query);
        return res.status(200).json({
            success: true,
            data: friends,
        });
    }
    catch (error) {
        console.error("Error in getFriends:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve friends",
        });
    }
};
exports.getFriends = getFriends;
