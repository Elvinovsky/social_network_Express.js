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
exports.postsRouter = void 0;
const express_1 = require("express");
const posts_service_1 = require("../domains/posts-service");
const super_admin_authentication_1 = require("../middlewares/guard-authentication/super-admin-authentication");
const check_bodyPost_1 = require("../middlewares/body-validator/check-bodyPost");
const posts_query_repository_1 = require("../repositories/queryRepository/posts-query-repository");
const feedback_service_1 = require("../domains/feedback-service");
const check_bodyComment_1 = require("../middlewares/body-validator/check-bodyComment");
exports.postsRouter = (0, express_1.Router)();
exports.postsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const getAllPosts = yield posts_query_repository_1.postQueryRepository.returnOfAllPosts(req.query.searchTitleTerm, Number(req.query.pageNumber), Number(req.query.pageSize), req.query.sortBy, req.query.sortDirection);
    console.log(getAllPosts);
    console.log(typeof getAllPosts);
    res.send(getAllPosts);
}));
exports.postsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const getByIdPost = yield posts_service_1.postsService.findPostById(req.params.id);
    return getByIdPost === null
        ? res.sendStatus(404)
        : res.send(getByIdPost);
}));
exports.postsRouter.get('/:postId/comments', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const getCommentsByPostId = yield posts_query_repository_1.postQueryRepository.searchCommentsByPostId(req.params.postId, Number(req.query.pageNumber), Number(req.query.pageSize), req.query.sortBy, req.query.sortDirection);
    if (!getCommentsByPostId) {
        res.sendStatus(404);
        return;
    }
    res.send(getCommentsByPostId);
}));
exports.postsRouter.post('/:postId/comments', check_bodyComment_1.validatorInputComment, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validatorPostIdForCreateComments = yield feedback_service_1.feedbacksService.searchPostIdForComments(req.params.postId); //todo custom validator
    if (!validatorPostIdForCreateComments) {
        res.sendStatus(404);
        return;
    }
    const comment = yield feedback_service_1.feedbacksService.createComment(req.params.postId, req.user.id, req.body.content);
    res.status(201).send(comment);
}));
exports.postsRouter.post('/', check_bodyPost_1.validatorInputPostBody, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const createdNewPost = yield posts_service_1.postsService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId);
    res.status(201).send(createdNewPost);
    return;
}));
exports.postsRouter.put('/:id', check_bodyPost_1.validatorInputPostBody, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validatorPostByIdForUpdate = yield posts_service_1.postsService.findPostById(req.params.id);
    if (!validatorPostByIdForUpdate) {
        res.sendStatus(404);
        return;
    }
    const postForUpdate = yield posts_service_1.postsService
        .updatePostById(req.params.id, req.body.title, req.body.shortDescription, req.body.content);
    if (postForUpdate) {
        res.sendStatus(204);
        return;
    }
}));
exports.postsRouter.delete('/:id', super_admin_authentication_1.superAdminAuthentication, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const foundPostDelete = yield posts_service_1.postsService.postByIdDelete(req.params.id);
    if (!foundPostDelete) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204);
    return;
}));
