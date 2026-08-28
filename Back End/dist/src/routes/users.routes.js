"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = require("../controllers/users.controller");
const auth_middleware_js_1 = require("../middlewares/auth.middleware.js");
const router = (0, express_1.Router)();
router.get('/search', auth_middleware_js_1.authMiddleware, users_controller_1.searchUsers);
router.get('/:id', users_controller_1.getUserById);
exports.default = router;
