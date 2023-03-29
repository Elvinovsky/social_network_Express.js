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
exports.postsService = void 0;
const posts_db_repository_1 = require("../repositories/db/posts-db-repository");
exports.postsService = {
    searchBlogIdForPost(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield posts_db_repository_1.postsRepository.searchBlogIdForPost(blogId);
        });
    },
    findPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield posts_db_repository_1.postsRepository.findPostById(id);
        });
    },
    createPost(title, shortDescription, content, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const outputBlogName = posts_db_repository_1.postsRepository.searchBlogIdForPost.name;
            const newPost = {
                id: (+(new Date())).toString(),
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId,
                blogName: outputBlogName,
                createdAt: new Date().toISOString()
            };
            return yield posts_db_repository_1.postsRepository.addNewPost(newPost);
        });
    },
    updatePostById(id, title, shortDescription, content) {
        return __awaiter(this, void 0, void 0, function* () {
            return posts_db_repository_1.postsRepository.updatePostById(id, title, shortDescription, content);
        });
    },
    postByIdDelete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield posts_db_repository_1.postsRepository.postByIdDelete(id);
        });
    }
};
