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
exports.validatorInputBlogPostBody = exports.validatorInputPostBody = void 0;
const express_validator_1 = require("express-validator");
const posts_db_repository_1 = require("../../repositories/db/posts-db-repository");
const guard_authentication_1 = require("../guard-authentication");
const check_for_errors_1 = require("../check-for-errors");
const checksTitle = (0, express_validator_1.body)('title')
    .exists()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("length should be no more than 30 characters")
    .bail()
    .isString()
    .withMessage("is not a string");
const checksShortDescription = (0, express_validator_1.body)('shortDescription')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("must be at least 100 chars long")
    .bail()
    .isString()
    .withMessage("is not a string");
const checksContent = (0, express_validator_1.body)('content')
    .trim()
    .isLength({ min: 3, max: 1000 })
    .withMessage("length should be no more than 1000 characters")
    .bail()
    .isString()
    .withMessage("is not a string");
const checksBlogId = (0, express_validator_1.body)('blogId')
    .isString()
    .withMessage("is not a string")
    .bail()
    .custom((blogId) => __awaiter(void 0, void 0, void 0, function* () {
    const validationBlogId = yield posts_db_repository_1.postsRepository.searchBlogIdForPost(blogId);
    if (!validationBlogId) {
        throw new Error("blogId not found");
    }
}));
exports.validatorInputPostBody = [
    guard_authentication_1.guardAuthentication,
    checksTitle,
    checksShortDescription,
    checksContent,
    checksBlogId,
    check_for_errors_1.checkForErrors
];
exports.validatorInputBlogPostBody = [
    guard_authentication_1.guardAuthentication,
    checksTitle,
    checksShortDescription,
    checksContent,
    check_for_errors_1.checkForErrors
];
