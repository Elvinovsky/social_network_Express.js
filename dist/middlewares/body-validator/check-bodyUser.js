"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatorBodyUserRegistration = exports.validatorInputAuthRout = exports.validatorUserBodyRegistrationForSuperAdmin = exports.checksEmail = void 0;
const check_for_errors_1 = require("../check-for-errors");
const express_validator_1 = require("express-validator");
const super_admin_authentication_1 = require("../guard-authentication/super-admin-authentication");
const users_db_repository_1 = require("../../repositories/db/users-db-repository");
const checksLogin = (0, express_validator_1.body)('login')
    .matches(/^[a-zA-Z0-9_-]*$/)
    .withMessage("matches incorrect")
    .bail()
    .isString()
    .withMessage("is not a string")
    .bail()
    .isLength({ min: 3, max: 10 })
    .withMessage("length should be no more than 10 characters")
    .custom((login) => __awaiter(void 0, void 0, void 0, function* () {
    const validationLogin = yield users_db_repository_1.usersRepository.findByLoginOrEmail(login);
    if (validationLogin) {
        throw new Error("a user with this username already exists");
    }
}));
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
    .withMessage("is not a string")
    .custom((email) => __awaiter(void 0, void 0, void 0, function* () {
    const validationEmail = yield users_db_repository_1.usersRepository.findByLoginOrEmail(email);
    if (validationEmail) {
        throw new Error("your mailing address is already registered");
    }
}));
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
