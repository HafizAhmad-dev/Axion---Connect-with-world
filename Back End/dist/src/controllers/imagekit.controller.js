"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImageKitAuth = void 0;
const imagekit_js_1 = __importDefault(require("../config/imagekit.js"));
const getImageKitAuth = (req, res) => {
    const { token, expire, signature } = imagekit_js_1.default.helper.getAuthenticationParameters();
    res.status(200).json({
        token,
        expire,
        signature,
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    });
};
exports.getImageKitAuth = getImageKitAuth;
