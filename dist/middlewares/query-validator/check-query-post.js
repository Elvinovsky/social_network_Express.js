"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkQueryTitle = void 0;
const express_validator_1 = require("express-validator");
exports.checkQueryTitle = (0, express_validator_1.query)('title')
    .isLength({ max: 30 })
    .withMessage("length should be no more than 15 characters")
    .bail()
    .isString()
    .withMessage("is not a string");
