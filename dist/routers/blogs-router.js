"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
const express_1 = require("express");
const blogs_repository_1 = require("../repositories/blogs-repository");
const guard_authentication_1 = require("../middlewares/guard-authentication");
const check_for_errors_1 = require("../middlewares/check-for-errors");
const check_bodyBlog_1 = require("../middlewares/validation-inputBody/check-bodyBlog");
exports.blogsRouter = (0, express_1.Router)();
exports.blogsRouter.get('/', (req, res) => {
    const getAllBlogs = blogs_repository_1.blogsRepository.returnOfAllBlogs;
    res.send(getAllBlogs);
});
exports.blogsRouter.post('/', guard_authentication_1.guardAuthentication, check_bodyBlog_1.checkInputWebsiteUrl, check_bodyBlog_1.checkInputName, check_bodyBlog_1.checkInputDescription, check_for_errors_1.checkForErrors, (req, res) => {
    const createdBlog = blogs_repository_1.blogsRepository
        .addNewBlog(req.body.name, req.body.description, req.body.websiteUrl);
    res.status(201).send(createdBlog);
});
exports.blogsRouter.get('/:id', (req, res) => {
    const getByIdBlog = blogs_repository_1.blogsRepository.findBlogById(req.params.id);
    if (!getByIdBlog) {
        res.sendStatus(404);
        return;
    }
    res.send(getByIdBlog);
});
exports.blogsRouter.put('/:id', guard_authentication_1.guardAuthentication, check_bodyBlog_1.checkInputWebsiteUrl, check_bodyBlog_1.checkInputName, check_bodyBlog_1.checkInputDescription, check_for_errors_1.checkForErrors, (req, res) => {
    const searchBlogByIdForUpdate = blogs_repository_1.blogsRepository.findBlogById(req.params.id);
    if (!searchBlogByIdForUpdate) {
        res.sendStatus(404);
        return;
    }
    const foundBlogForUpdate = blogs_repository_1.blogsRepository
        .updateBlogById(req.params.id, req.body.name, req.body.description, req.body.websiteUrl);
    if (foundBlogForUpdate) {
        res.sendStatus(204);
        return;
    }
});
exports.blogsRouter.delete('/:id', guard_authentication_1.guardAuthentication, (req, res) => {
    const foundBlogDelete = blogs_repository_1.blogsRepository.searchBlogByIdDelete(req.params.id);
    if (!foundBlogDelete) {
        res.sendStatus(404);
    }
    res.sendStatus(204);
});
