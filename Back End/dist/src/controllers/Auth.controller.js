"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUser = exports.loginUser = exports.registerUser = void 0;
const handleValidatin_js_1 = require("../utils/handleValidatin.js");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwtToken_hook_js_1 = require("../utils/jwtToken.hook.js");
const userAuth_model_js_1 = require("../../database/models/userAuth.model.js");
const saltRounds = Number(process.env.SALT_ROUNDS) || 10;
const JWT_SECRET = process.env.JWT_SECRET;
//for registering the user
const registerUser = async (req, res) => {
    if ((0, handleValidatin_js_1.handleValidation)(req, res))
        return;
    const { email, username, password } = req.body;
    const hash = await bcrypt_1.default.hash(password, saltRounds);
    try {
        const newUser = await (0, userAuth_model_js_1.createUser)(username, email, hash);
        const token = (0, jwtToken_hook_js_1.signToken)({ userId: newUser.id });
        return res.status(201).json({
            message: "User registered successfully",
            User: newUser,
            token,
        });
    }
    catch (error) {
        console.error("Registration error:", error);
        // Handle database duplicate key error
        if (error.code === "23505") {
            // Check which constraint was violated
            if (error.constraint?.includes("username")) {
                return res.status(409).json({
                    code: error.code,
                    message: "Username already in use",
                    errors: { username: "Username already in use" },
                });
            }
            if (error.constraint?.includes("email")) {
                return res.status(409).json({
                    code: error.code,
                    message: "Email already in use",
                    errors: { email: "Email already in use" },
                });
            }
        }
        return res.status(500).json({
            code: error.code || "INTERNAL_SERVER_ERROR",
            message: "Registration failed",
            error: error.message,
        });
    }
};
exports.registerUser = registerUser;
//for llogin the user
const loginUser = async (req, res) => {
    // Validate request
    if ((0, handleValidatin_js_1.handleValidation)(req, res))
        return;
    const { username, email, password } = req.body;
    const identifier = username || email;
    // Missing credentials
    if (!identifier || !password) {
        return res.status(400).json({
            success: false,
            message: "Username/email and password are required",
        });
    }
    // Find user by username or email
    const user = await (0, userAuth_model_js_1.SignModule)(identifier);
    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Invalid credentials",
        });
    }
    // Check password
    const isCorrectPass = await bcrypt_1.default.compare(password, user.password);
    if (!isCorrectPass) {
        return res.status(401).json({
            success: false,
            message: "Invalid credentials",
        });
    }
    const token = (0, jwtToken_hook_js_1.signToken)({ userId: user.id });
    // Success
    return res.status(200).json({
        success: true,
        message: "Login successful",
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
        },
        token,
    });
};
exports.loginUser = loginUser;
//for verifying the token and returning text(on order)
const verifyUser = async (req, res) => {
    const userFromToken = req.user;
    if (!userFromToken) {
        return res.status(401).json({
            success: false,
            message: "User not authenticated",
        });
    }
    return res.status(200).json({
        success: true,
        user: userFromToken,
    });
};
exports.verifyUser = verifyUser;
