"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checksBlogId = exports.checksContent = exports.checksShortDescription = exports.checksTitle = void 0;
const express_validator_1 = require("express-validator");
exports.checksTitle = (0, express_validator_1.check)('title')
    .exists()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage({ message: "length should be no more than 30 characters", field: "title" })
    .isString()
    .withMessage({ message: "is not a string", field: "title" });
exports.checksShortDescription = (0, express_validator_1.check)('shortDescription')
    .exists(undefined)
    .trim()
    .isLength({ min: 10, max: 100 })
    .withMessage({ message: "must be at least 100 chars long", field: "shortDescription" })
    .isString()
    .withMessage({ message: "is not a string", field: "shortDescription" });
exports.checksContent = (0, express_validator_1.check)('content')
    .exists()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage({ message: "length should be no more than 1000 characters", field: "content" })
    .isString()
    .withMessage({ message: "is not a string", field: "content" });
exports.checksBlogId = (0, express_validator_1.check)('blogId')
    .exists()
    .isString()
    .withMessage({ message: "is not a string", field: "blogId" });
//TODO postsRepository.searchBlogIdForPost(blogId)
