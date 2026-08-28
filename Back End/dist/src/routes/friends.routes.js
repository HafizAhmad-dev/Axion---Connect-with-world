"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Friends_controller_js_1 = require("../controllers/Friends.controller.js");
const router = (0, express_1.Router)();
router.get("/search", Friends_controller_js_1.getFriends);
exports.default = router;
