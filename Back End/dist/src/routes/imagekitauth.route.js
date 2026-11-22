"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const imagekit_controller_js_1 = require("../controllers/imagekit.controller.js");
const auth_middleware_js_1 = require("../middlewares/auth.middleware.js");
const router = (0, express_1.Router)();
router.get("/auth", auth_middleware_js_1.authMiddleware, imagekit_controller_js_1.getImageKitAuth);
exports.default = router;
