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
exports.postsRepository = void 0;
const in_memory_1 = require("../../database/in-memory");
exports.postsRepository = {
    // тестовое удаление базы данных Постов
    testingDeleteAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            return in_memory_1.inMemory.allPosts = [];
        });
    },
    // все существующие посты.
    returnOfAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            return in_memory_1.inMemory.allPosts;
        });
    },
    //создание и добавление нового поста в базу данных.
    addNewPost(title, shortDescription, content, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const outputBlogName = this.searchBlogIdForPost.name;
            const createNewPost = {
                id: (+(new Date())).toString(),
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId,
                blogName: outputBlogName,
                createdAt: new Date().toISOString()
            };
            in_memory_1.inMemory.allPosts.push(createNewPost);
            return createNewPost;
        });
    },
    //поиск поста по ID.
    findPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return in_memory_1.inMemory.allPosts.find(el => el.id === id);
        });
    },
    // обновление поста по ID.
    updatePostById(id, title, shortDescription, content) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this.findPostById(id)) {
                in_memory_1.inMemory.allPosts.forEach(el => {
                    el.title = title;
                    el.shortDescription = shortDescription;
                    el.content = content;
                });
                return true;
            }
            return false;
        });
    },
    //поиск ID блога для поста.
    searchBlogIdForPost(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogIdForPost = yield in_memory_1.inMemory.allBlogs.find(el => el.id === blogId);
            if (blogIdForPost) {
                return blogIdForPost;
            }
            else {
                return undefined;
            }
        });
    },
    // поиск и удаление поста по ID.
    PostByIdDelete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const index = in_memory_1.inMemory.allBlogs.findIndex(b => b.id === id);
            if (index > -1) {
                in_memory_1.inMemory.allBlogs.splice(index, 1);
                return true;
            }
            return false;
        });
    }
};
