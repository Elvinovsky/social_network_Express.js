"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkQueryName = void 0;
const express_validator_1 = require("express-validator");
exports.checkQueryName = (0, express_validator_1.buildCheckFunction)(['query'])('name')
    .trim()
    .isLength({ max: 15 })
    .withMessage("length should be no more than 15 characters")
    .bail()
    .isString()
    .withMessage("is not a string");
