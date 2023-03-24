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
const guard_authentication_1 = require("../middlewares/guard-authentication");
const check_bodyPost_1 = require("../middlewares/validation-inputBody/check-bodyPost");
const check_for_errors_1 = require("../middlewares/check-for-errors");
const query_db_repository_1 = require("../repositories/db/query-db-repository");
exports.postsRouter = (0, express_1.Router)();
exports.postsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const getAllPosts = yield query_db_repository_1.queryDbRepository.returnOfAllPosts();
    res.send(getAllPosts);
    return;
}));
exports.postsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const getByIdPost = yield query_db_repository_1.queryDbRepository.findPostById(req.params.id);
    return getByIdPost === null
        ? res.sendStatus(404)
        : res.send(getByIdPost);
}));
exports.postsRouter.get('/blogs/:blogId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const getByIdPost = yield query_db_repository_1.queryDbRepository.searchBlogIdForPost(req.params.blogId);
    return getByIdPost === null
        ? res.sendStatus(404)
        : res.send(getByIdPost);
}));
exports.postsRouter.post('/', guard_authentication_1.guardAuthentication, check_bodyPost_1.checksTitle, check_bodyPost_1.checksShortDescription, check_bodyPost_1.checksContent, check_bodyPost_1.checksBlogId, check_for_errors_1.checkForErrors, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const createdNewPost = yield posts_service_1.postsService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId);
    res.status(201).send(createdNewPost);
    return;
}));
exports.postsRouter.post('/blogs/:blogId', guard_authentication_1.guardAuthentication, check_bodyPost_1.checksTitle, check_bodyPost_1.checksShortDescription, check_bodyPost_1.checksContent, check_for_errors_1.checkForErrors, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validatorBlogIdForCreatePost = yield posts_service_1.postsService.searchBlogIdForPost(req.params.blogId);
    if (!validatorBlogIdForCreatePost) {
        res.sendStatus(404);
        return;
    }
    const createdNewPost = yield posts_service_1.postsService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.params.blogId);
    res.status(201).send(createdNewPost);
    return;
}));
exports.postsRouter.put('/:id', guard_authentication_1.guardAuthentication, check_bodyPost_1.checksTitle, check_bodyPost_1.checksShortDescription, check_bodyPost_1.checksContent, check_bodyPost_1.checksBlogId, check_for_errors_1.checkForErrors, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.postsRouter.delete('/:id', guard_authentication_1.guardAuthentication, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const foundPostDelete = yield posts_service_1.postsService.postByIdDelete(req.params.id);
    if (!foundPostDelete) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204);
    return;
}));
