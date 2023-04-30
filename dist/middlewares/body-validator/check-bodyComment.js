"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatorInputComment = exports.checkInputContent = void 0;
const express_validator_1 = require("express-validator");
const check_for_errors_1 = require("../check-for-errors");
exports.checkInputContent = (0, express_validator_1.body)('content')
    .trim()
    .isLength({ min: 20, max: 300 })
    .withMessage("length should be no more than 300 characters")
    .bail()
    .isString()
    .withMessage("is not a string");
exports.validatorInputComment = [
    exports.checkInputContent,
    check_for_errors_1.checkForErrors
];
