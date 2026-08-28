"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidator = exports.signupValidator = void 0;
const express_validator_1 = require("express-validator");
const reservedUsernames = [
    "admin",
    "root",
    "system",
    "support",
    "api",
    "null",
    "undefined",
    "owner",
    "moderator",
    "staff",
];
exports.signupValidator = [
    (0, express_validator_1.body)("email")
        .trim()
        .notEmpty()
        .withMessage("Email is Required!")
        .isEmail()
        .withMessage("Invalid email")
        .normalizeEmail(),
    (0, express_validator_1.body)("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters")
        .matches(/[A-Z]/)
        .withMessage("Password must contain at least one uppercase letter")
        .matches(/[a-z]/)
        .withMessage("Password must contain at least one lowercase letter")
        .matches(/[0-9]/)
        .withMessage("Password must contain at least one number")
        .matches(/[!@#$%^&*(),.?":{}|<>_\-]/)
        .withMessage("Password must contain at least one special character")
        .isLength({ min: 6, max: 16 })
        .withMessage("Password must be at least 6 chars and max 16 chars"),
    (0, express_validator_1.body)("username")
        .trim()
        .toLowerCase()
        .isLength({ min: 6, max: 16 })
        .withMessage("Username should be atleast 6 characters minimum!")
        .notEmpty()
        .withMessage("Username is required")
        .matches(/^[a-z0-9_]+$/)
        .withMessage("Only letters, numbers, and underscore are allowed")
        .custom((value) => {
        if (reservedUsernames.some((word) => value.includes(word))) {
            throw new Error("This username is not allowed");
        }
        return true;
    }),
];
exports.loginValidator = [
    (0, express_validator_1.body)("email")
        .optional()
        .isEmail()
        .withMessage("Invalid email")
        .normalizeEmail(),
    (0, express_validator_1.body)("username").optional().trim().toLowerCase(),
    (0, express_validator_1.body)("password").trim().notEmpty().withMessage("Password is required"),
    (0, express_validator_1.body)().custom((body) => {
        if (!body.email && !body.username) {
            throw new Error("Either email or username is required");
        }
        return true;
    }),
];
