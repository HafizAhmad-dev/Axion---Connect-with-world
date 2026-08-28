"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jwtToken_hook_js_1 = require("../utils/jwtToken.hook.js");
const userAuth_model_js_1 = require("../../database/models/userAuth.model.js");
const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = (0, jwtToken_hook_js_1.verifyToken)(token);
        const userId = decoded.userId;
        const user = await (0, userAuth_model_js_1.verifyUserMODULE)(userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }
        // IMPORTANT: attach user to request
        req.user = {
            id: user.id,
            displayName: user.displayName,
            username: user.username,
            email: user.email
        };
        next();
    }
    catch (err) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};
exports.authMiddleware = authMiddleware;
