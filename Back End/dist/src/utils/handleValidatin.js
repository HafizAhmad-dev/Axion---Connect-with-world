"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidation = void 0;
const express_validator_1 = require("express-validator");
const handleValidation = (req, res) => {
    console.log('Request body:', req.body);
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const formattedErrors = {};
        errors.array().forEach((err) => {
            formattedErrors[err.path] = err.msg;
        });
        res.status(400).json({ errors: formattedErrors });
        return true;
    }
    return false;
};
exports.handleValidation = handleValidation;
