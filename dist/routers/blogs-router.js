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
const blogs_repository_1 = require("../repositories/blogs-repository");
const guard_authentication_1 = require("../middlewares/guard-authentication");
const check_for_errors_1 = require("../middlewares/check-for-errors");
const check_bodyBlog_1 = require("../middlewares/validation-inputBody/check-bodyBlog");
exports.blogsRouter = (0, express_1.Router)();
exports.blogsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const getAllBlogs = yield blogs_repository_1.blogsRepository.returnOfAllBlogs();
    res.send(getAllBlogs);
    return;
}));
exports.blogsRouter.post('/', guard_authentication_1.guardAuthentication, check_bodyBlog_1.checkInputWebsiteUrl, check_bodyBlog_1.checkInputName, check_bodyBlog_1.checkInputDescription, check_for_errors_1.checkForErrors, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const createdBlog = yield blogs_repository_1.blogsRepository
        .addNewBlog(req.body.name, req.body.description, req.body.websiteUrl);
    res.status(201).send(createdBlog);
    return;
}));
exports.blogsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const getByIdBlog = yield blogs_repository_1.blogsRepository.findBlogById(req.params.id);
    if (!getByIdBlog) {
        res.sendStatus(404);
        return;
    }
    res.send(getByIdBlog);
    return;
}));
exports.blogsRouter.put('/:id', guard_authentication_1.guardAuthentication, check_bodyBlog_1.checkInputWebsiteUrl, check_bodyBlog_1.checkInputName, check_bodyBlog_1.checkInputDescription, check_for_errors_1.checkForErrors, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const searchBlogByIdForUpdate = yield blogs_repository_1.blogsRepository.findBlogById(req.params.id);
    if (!searchBlogByIdForUpdate) {
        res.sendStatus(404);
        return;
    }
    const foundBlogForUpdate = yield blogs_repository_1.blogsRepository
        .updateBlogById(req.params.id, req.body.name, req.body.description, req.body.websiteUrl);
    if (foundBlogForUpdate) {
        res.sendStatus(204);
        return;
    }
}));
exports.blogsRouter.delete('/:id', guard_authentication_1.guardAuthentication, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const foundBlogDelete = yield blogs_repository_1.blogsRepository.searchBlogByIdDelete(req.params.id);
    if (!foundBlogDelete) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204);
    return;
}));
