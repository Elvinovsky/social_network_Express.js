"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkInputDescription = exports.checkInputWebsiteUrl = exports.checkInputName = void 0;
const express_validator_1 = require("express-validator");
exports.checkInputName = (0, express_validator_1.body)('name')
    .trim()
    .isLength({ min: 3, max: 15 })
    .withMessage("length should be no more than 15 characters")
    .bail()
    .isString()
    .withMessage("is not a string");
exports.checkInputWebsiteUrl = (0, express_validator_1.body)('websiteUrl')
    .matches(/^(http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/)
    .withMessage("is not a link to the site")
    .bail()
    .isString()
    .withMessage("is not a string")
    .isLength({ min: 10, max: 100 })
    .withMessage("must be at least 100 chars long");
exports.checkInputDescription = (0, express_validator_1.body)('description')
    .trim()
    .isLength({ min: 3, max: 500 })
    .withMessage("length should be no more than 500 characters")
    .bail()
    .isString()
    .withMessage("is not a string");