"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
const express_1 = require("express");
const posts_repository_1 = require("../repositories/posts-repository");
const guard_authentication_1 = require("../middlewares/guard-authentication");
const check_bodyPost_1 = require("../middlewares/validation-inputBody/check-bodyPost");
const check_for_errors_1 = require("../middlewares/check-for-errors");
exports.postsRouter = (0, express_1.Router)();
exports.postsRouter.get('/', (req, res) => {
    const getAllPosts = posts_repository_1.postsRepository.returnOfAllPosts;
    res.send(getAllPosts);
});
exports.postsRouter.post('/', guard_authentication_1.guardAuthentication, check_bodyPost_1.checksShortDescription, check_bodyPost_1.checksTitle, check_bodyPost_1.checksContent, check_bodyPost_1.checksBlogId, check_for_errors_1.checkForErrors, (req, res) => {
    const validationInputBlogId = posts_repository_1.postsRepository.searchBlogIdForPost(req.body.blogId);
    if (!validationInputBlogId) {
        res.status(404).send("blogId not found");
        return;
    }
    const createdNewPost = posts_repository_1.postsRepository.addNewPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId);
    res.status(201).send(createdNewPost);
});
exports.postsRouter.get('/:id', (req, res) => {
    const getByIdPost = posts_repository_1.postsRepository.findPostById(req.params.id);
    if (!getByIdPost) {
        res.sendStatus(404);
    }
    res.send(getByIdPost);
});
exports.postsRouter.put('/:id', guard_authentication_1.guardAuthentication, check_bodyPost_1.checksShortDescription, check_bodyPost_1.checksTitle, check_bodyPost_1.checksContent, check_bodyPost_1.checksBlogId, check_for_errors_1.checkForErrors, (req, res) => {
    const searchPostByIdForUpdate = posts_repository_1.postsRepository.findPostById(req.params.id);
    if (!searchPostByIdForUpdate) {
        res.sendStatus(404);
        return;
    }
    const validationInputBlogId = posts_repository_1.postsRepository.searchBlogIdForPost(req.body.blogId);
    if (!validationInputBlogId) {
        res.status(404).send("blogId not found");
        return;
    }
    const foundPostForUpdate = posts_repository_1.postsRepository
        .updatePostById(req.params.id, req.body.title, req.body.shortDescription, req.body.content, req.body.blogId);
    if (foundPostForUpdate) {
        res.sendStatus(204);
    }
});
exports.postsRouter.delete('/:id', guard_authentication_1.guardAuthentication, (req, res) => {
    const foundPostDelete = posts_repository_1.postsRepository.searchForPostByIdDelete(req.params.id);
    if (!foundPostDelete) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204);
});
