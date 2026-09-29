"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jwtToken_hook_js_1 = require("../utils/jwtToken.hook.js");
const userAuth_model_js_1 = require("../../database/models/userAuth.model.js");
const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "No token provided",
        });
    }
    const token = authHeader.split(" ")[1];
    let decoded;
    try {
        decoded = (0, jwtToken_hook_js_1.verifyToken)(token);
    }
    catch {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
    try {
        const user = await (0, userAuth_model_js_1.verifyUserMODULE)(decoded.userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }
        req.user = {
            id: user.id,
            displayName: user.displayName,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
        next();
    }
    catch (err) {
        console.error("Auth middleware database error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.authMiddleware = authMiddleware;
