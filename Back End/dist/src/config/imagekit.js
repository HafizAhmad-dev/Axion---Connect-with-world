"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodejs_1 = __importDefault(require("@imagekit/nodejs"));
const imagekit = new nodejs_1.default({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});
exports.default = imagekit;
