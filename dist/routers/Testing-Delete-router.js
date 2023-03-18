"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAllDataRouter = void 0;
const express_1 = require("express");
const blogs_repository_1 = require("../repositories/blogs-repository");
const posts_repository_1 = require("../repositories/posts-repository");
exports.deleteAllDataRouter = (0, express_1.Router)();
exports.deleteAllDataRouter.delete('/all-data', (req, res) => {
    blogs_repository_1.blogsRepository.testingDeleteAllBlogs();
    posts_repository_1.postsRepository.testingDeleteAllPosts();
    res.send(204);
});
