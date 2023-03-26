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
exports.blogsRouter = void 0;
const express_1 = require("express");
const blogs_service_1 = require("../domains/blogs-service");
const guard_authentication_1 = require("../middlewares/guard-authentication");
const check_for_errors_1 = require("../middlewares/check-for-errors");
const check_bodyBlog_1 = require("../middlewares/body-validator/check-bodyBlog");
const query_repository_1 = require("../repositories/query-repository");
const check_bodyPost_1 = require("../middlewares/body-validator/check-bodyPost");
const posts_service_1 = require("../domains/posts-service");
exports.blogsRouter = (0, express_1.Router)();
exports.blogsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const getAllBlogs = yield query_repository_1.queryRepository.returnOfAllBlogs(req.query.searchNameTerm, req.query.pageNumber, req.query.pageSize, req.query.sortBy, req.query.sortDirection);
    res.send(getAllBlogs);
    return;
}));
exports.blogsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const getByIdBlog = yield query_repository_1.queryRepository.findBlogById(req.params.id);
    if (!getByIdBlog) {
        res.sendStatus(404);
        return;
    }
    res.send(getByIdBlog);
    return;
}));
exports.blogsRouter.get('/:blogId/posts', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const getByBlogIdPosts = yield query_repository_1.queryRepository.searchPostByBlogId(req.params.blogId, req.query.pageNumber, req.query.pageSize, req.query.sortBy, req.query.sortDirection);
    return getByBlogIdPosts === null || []
        ? res.sendStatus(404)
        : res.send(getByBlogIdPosts);
}));
exports.blogsRouter.post('/', guard_authentication_1.guardAuthentication, check_bodyBlog_1.checkInputName, check_bodyBlog_1.checkInputWebsiteUrl, check_bodyBlog_1.checkInputDescription, check_for_errors_1.checkForErrors, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const createdBlog = yield blogs_service_1.blogsService
        .createBlog(req.body.name, req.body.description, req.body.websiteUrl);
    res.status(201).send(createdBlog);
    return;
}));
exports.blogsRouter.post('/:blogId/posts', guard_authentication_1.guardAuthentication, check_bodyPost_1.checksTitle, check_bodyPost_1.checksShortDescription, check_bodyPost_1.checksContent, check_for_errors_1.checkForErrors, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validatorBlogIdForCreatePost = yield posts_service_1.postsService.searchBlogIdForPost(req.params.blogId);
    if (!validatorBlogIdForCreatePost) {
        res.sendStatus(404);
        return;
    }
    const createdNewPost = yield posts_service_1.postsService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.params.blogId);
    res.status(201).send(createdNewPost);
    return;
}));
exports.blogsRouter.post('/', guard_authentication_1.guardAuthentication, check_bodyBlog_1.checkInputName, check_bodyBlog_1.checkInputWebsiteUrl, check_bodyBlog_1.checkInputDescription, check_for_errors_1.checkForErrors, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const createdBlog = yield blogs_service_1.blogsService
        .createBlog(req.body.name, req.body.description, req.body.websiteUrl);
    res.status(201).send(createdBlog);
    return;
}));
exports.blogsRouter.put('/:id', guard_authentication_1.guardAuthentication, check_bodyBlog_1.checkInputName, check_bodyBlog_1.checkInputWebsiteUrl, check_bodyBlog_1.checkInputDescription, check_for_errors_1.checkForErrors, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const searchBlogByIdForUpdate = yield blogs_service_1.blogsService.findBlogById(req.params.id);
    if (!searchBlogByIdForUpdate) {
        res.sendStatus(404);
        return;
    }
    const foundBlogForUpdate = yield blogs_service_1.blogsService
        .updateBlogById(req.params.id, req.body.name, req.body.description, req.body.websiteUrl);
    if (foundBlogForUpdate) {
        res.sendStatus(204);
        return;
    }
}));
exports.blogsRouter.delete('/:id', guard_authentication_1.guardAuthentication, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const foundBlogDelete = yield blogs_service_1.blogsService.BlogByIdDelete(req.params.id);
    if (!foundBlogDelete) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204);
    return;
}));
