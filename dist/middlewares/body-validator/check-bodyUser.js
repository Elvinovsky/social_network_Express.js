"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatorBodyUserRegistration = exports.validatorInputAuthRout = exports.validatorUserBodyRegistrationForSuperAdmin = exports.checksEmail = void 0;
const check_for_errors_1 = require("../check-for-errors");
const express_validator_1 = require("express-validator");
const super_admin_authentication_1 = require("../guard-authentication/super-admin-authentication");
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
exports.checksEmail = (0, express_validator_1.body)('email')
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .withMessage("is not a link to the email")
    .bail()
    .isString()
    .withMessage("is not a string");
const checkInputLoginOrEmail = (0, express_validator_1.body)('loginOrEmail')
    .isString()
    .withMessage("is not a string");
exports.validatorUserBodyRegistrationForSuperAdmin = [
    super_admin_authentication_1.superAdminAuthentication,
    checksLogin,
    checksPassword,
    exports.checksEmail,
    check_for_errors_1.checkForErrors
];
exports.validatorInputAuthRout = [
    checkInputLoginOrEmail,
    checksPassword,
    check_for_errors_1.checkForErrors
];
exports.validatorBodyUserRegistration = [
    checksLogin,
    checksPassword,
    exports.checksEmail,
    check_for_errors_1.checkForErrors
];
