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
exports.checksBlogId = exports.checksContent = exports.checksShortDescription = exports.checksTitle = void 0;
const express_validator_1 = require("express-validator");
const posts_db_repository_1 = require("../../repositories/db/posts-db-repository");
exports.checksTitle = (0, express_validator_1.check)('title')
    .exists()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage({ message: "length should be no more than 30 characters", field: "title" })
    .isString()
    .withMessage({ message: "is not a string", field: "title" });
exports.checksShortDescription = (0, express_validator_1.check)('shortDescription')
    .trim()
    .isLength({ min: 10, max: 100 })
    .withMessage({ message: "must be at least 100 chars long", field: "shortDescription" })
    .isString()
    .withMessage({ message: "is not a string", field: "shortDescription" });
exports.checksContent = (0, express_validator_1.check)('content')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage({ message: "length should be no more than 1000 characters", field: "content" })
    .isString()
    .withMessage({ message: "is not a string", field: "content" });
exports.checksBlogId = (0, express_validator_1.check)('blogId')
    .isString()
    .withMessage({ message: "is not a string", field: "blogId" })
    .custom((blogId) => __awaiter(void 0, void 0, void 0, function* () {
    const validationBlogId = yield posts_db_repository_1.postsRepository.searchBlogIdForPost(blogId);
    if (!validationBlogId) {
        throw new Error('blogId not found');
    }
}));
