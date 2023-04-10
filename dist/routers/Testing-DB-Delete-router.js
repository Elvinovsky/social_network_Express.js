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
exports.deleteAllDataRouter = void 0;
const express_1 = require("express");
const blogs_db_repository_1 = require("../repositories/db/blogs-db-repository");
const posts_db_repository_1 = require("../repositories/db/posts-db-repository");
const users_db_repository_1 = require("../repositories/db/users-db-repository");
const feedbacks_db_repository_1 = require("../repositories/db/feedbacks-db-repository");
exports.deleteAllDataRouter = (0, express_1.Router)();
exports.deleteAllDataRouter.delete('/all-data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield blogs_db_repository_1.blogsRepository.testingDeleteAllBlogs();
    yield posts_db_repository_1.postsRepository.testingDeleteAllPosts();
    yield users_db_repository_1.usersRepository.testingDeleteAllUsers();
    yield feedbacks_db_repository_1.feedBacksRepository.testingDeleteAllComments();
    res.send(204);
    return;
}));
