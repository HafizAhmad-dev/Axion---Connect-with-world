"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profile_controller_1 = require("../controllers/profile.controller");
const auth_middleware_js_1 = require("../middlewares/auth.middleware.js");
const profile_controller_2 = require("../controllers/profile.controller");
const multer_upload_js_1 = __importDefault(require("../middlewares/multer.upload.js"));
const router = (0, express_1.Router)();
router.get('/', auth_middleware_js_1.authMiddleware, profile_controller_2.getUserProfile);
router.patch('/displayname', auth_middleware_js_1.authMiddleware, profile_controller_1.updateDisplayName);
router.patch('/username', auth_middleware_js_1.authMiddleware, profile_controller_1.updateUsername);
router.patch('/password', auth_middleware_js_1.authMiddleware, profile_controller_1.updatePassword);
router.post('/profile-picture', auth_middleware_js_1.authMiddleware, multer_upload_js_1.default.single('avatar'), profile_controller_1.updateProfilePicture);
exports.default = router;
