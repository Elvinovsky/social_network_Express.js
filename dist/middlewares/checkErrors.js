"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkErrors = void 0;
const express_validator_1 = require("express-validator");
const errorFormatter = ({ msg }) => {
    // Build your resulting errors however you want! String, object, whatever - it works!
    return Object.assign({}, msg);
};
exports.checkErrors = ((req, res, next) => {
    const error = (0, express_validator_1.validationResult)(req).formatWith(errorFormatter);
    if (!error.isEmpty()) {
        return res.json({ errorsMessages: error.array() });
    }
    return next();
});
