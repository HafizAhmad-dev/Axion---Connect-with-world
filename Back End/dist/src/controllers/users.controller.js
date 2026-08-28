"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.searchUsers = void 0;
const users_model_js_1 = require("../../database/models/users.model.js");
const searchUsers = async (req, res) => {
    const q = (req.query.q || "").trim().toLowerCase();
    console.log('usres from req', req.user);
    const userId = req.user.id;
    if (!q) {
        return res.status(400).json({
            success: false,
            message: "Query is missing",
        });
    }
    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "userId is missing",
        });
    }
    const users = await (0, users_model_js_1.searchUsersMODEL)(q, userId);
    if (users.length === 0) {
        return res.json({
            success: true,
            data: users,
            message: 'No Users found'
        });
    }
    ;
    return res.json({
        success: true,
        data: users
    });
};
exports.searchUsers = searchUsers;
const getUserById = async (req, res) => {
    const id = req.params.id;
    if (typeof id !== 'string' || !id.trim()) {
        return res.status(400).json({ message: "Invalid or missing user id" });
    }
    try {
        const user = await (0, users_model_js_1.getUserByIdModel)(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ success: true, user });
    }
    catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getUserById = getUserById;
