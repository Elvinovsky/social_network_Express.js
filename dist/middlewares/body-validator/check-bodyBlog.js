"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatorBlogInputBody = void 0;
const express_validator_1 = require("express-validator");
const check_for_errors_1 = require("../check-for-errors");
const super_admin_authentication_1 = require("../guard-authentication/super-admin-authentication");
const checkInputName = (0, express_validator_1.body)('name')
    .trim()
    .isLength({ min: 3, max: 15 })
    .withMessage("length should be no more than 15 characters")
    .bail()
    .isString()
    .withMessage("is not a string");
const checkInputWebsiteUrl = (0, express_validator_1.body)('websiteUrl')
    .matches(/^(http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/)
    .withMessage("is not a link to the site")
    .bail()
    .isString()
    .withMessage("is not a string")
    .isLength({ min: 10, max: 100 })
    .withMessage("must be at least 100 chars long");
const checkInputDescription = (0, express_validator_1.body)('description')
    .trim()
    .isLength({ min: 3, max: 500 })
    .withMessage("length should be no more than 500 characters")
    .bail()
    .isString()
    .withMessage("is not a string");
exports.validatorBlogInputBody = [
    super_admin_authentication_1.superAdminAuthentication,
    checkInputName,
    checkInputWebsiteUrl,
    checkInputDescription,
    check_for_errors_1.checkForErrors
];
