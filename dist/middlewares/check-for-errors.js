"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkForErrors = void 0;
const express_validator_1 = require("express-validator");
exports.checkForErrors = ((req, res, next) => {
    const errorFormatter = ({ msg, param }) => {
        // Build your resulting errors however you want! String, object, whatever - it works!
        return { message: msg, field: param };
    };
    const error = (0, express_validator_1.validationResult)(req).formatWith(errorFormatter);
    if (!error.isEmpty()) {
        return res.status(400).json({ errorsMessages: error.array() });
    }
    return next();
});
