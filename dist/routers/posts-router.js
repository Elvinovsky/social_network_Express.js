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
const posts_repository_1 = require("../repositories/posts-repository");
const guard_authentication_1 = require("../middlewares/guard-authentication");
const check_bodyPost_1 = require("../middlewares/validation-inputBody/check-bodyPost");
const check_for_errors_1 = require("../middlewares/check-for-errors");
exports.postsRouter = (0, express_1.Router)();
exports.postsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const getAllPosts = yield posts_repository_1.postsRepository.returnOfAllPosts();
    res.send(getAllPosts);
    return;
}));
exports.postsRouter.post('/', guard_authentication_1.guardAuthentication, check_bodyPost_1.checksShortDescription, check_bodyPost_1.checksTitle, check_bodyPost_1.checksContent, check_bodyPost_1.checksBlogId, check_for_errors_1.checkForErrors, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const createdNewPost = yield posts_repository_1.postsRepository.addNewPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId);
    res.status(201).send(createdNewPost);
    return;
}));
exports.postsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const getByIdPost = yield posts_repository_1.postsRepository.findPostById(req.params.id);
    if (!getByIdPost) {
        res.sendStatus(404);
    }
    res.send(getByIdPost);
    return;
}));
exports.postsRouter.put('/:id', guard_authentication_1.guardAuthentication, check_bodyPost_1.checksShortDescription, check_bodyPost_1.checksTitle, check_bodyPost_1.checksContent, check_bodyPost_1.checksBlogId, check_for_errors_1.checkForErrors, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const searchPostByIdForUpdate = yield posts_repository_1.postsRepository.findPostById(req.params.id);
    if (!searchPostByIdForUpdate) {
        res.sendStatus(404);
        return;
    }
    const foundPostForUpdate = yield posts_repository_1.postsRepository
        .updatePostById(req.params.id, req.body.title, req.body.shortDescription, req.body.content, req.body.blogId);
    if (foundPostForUpdate) {
        res.sendStatus(204);
        return;
    }
}));
exports.postsRouter.delete('/:id', guard_authentication_1.guardAuthentication, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const foundPostDelete = yield posts_repository_1.postsRepository.PostByIdDelete(req.params.id);
    if (!foundPostDelete) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204);
    return;
}));
