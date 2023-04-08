"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatorInputAuthRout = exports.validatorInputUserBody = void 0;
const check_for_errors_1 = require("../check-for-errors");
const express_validator_1 = require("express-validator");
const guard_authentication_1 = require("../guard-authentication");
const checksLogin = (0, express_validator_1.body)('login')
    .matches(/^[a-zA-Z0-9_-]*$/)
    .withMessage("matches incorrect")
    .bail()
    .isString()
    .withMessage("is not a string")
    .bail()
    .isLength({ min: 3, max: 10 })
    .withMessage("length should be no more than 10 characters");
const checksPassword = (0, express_validator_1.body)('password')
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage("must be at least 20 chars long")
    .bail()
    .isString()
    .withMessage("is not a string");
const checkInputEmail = (0, express_validator_1.body)('email')
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .withMessage("is not a link to the email")
    .bail()
    .isString()
    .withMessage("is not a string");
exports.validatorInputUserBody = [
    guard_authentication_1.guardAuthentication,
    checksLogin,
    checksPassword,
    checkInputEmail,
    check_for_errors_1.checkForErrors
];
exports.validatorInputAuthRout = [
    checksLogin,
    checksPassword,
    checkInputEmail,
    check_for_errors_1.checkForErrors
];
