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
const runDB_1 = require("../../database/runDB");
const mongodb_1 = require("mongodb");
const filters_1 = require("../../functions/filters");
exports.postsRepository = {
    // тестовое удаление базы данных Постов
    testingDeleteAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield runDB_1.postsCollection.deleteMany({});
        });
    },
    //поиск поста по ID.
    findPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield runDB_1.postsCollection.findOne({ id }, filters_1.blockMongo_Id);
        });
    },
    //создание и добавление нового поста в базу данных.
    addNewPost(newPost) {
        return __awaiter(this, void 0, void 0, function* () {
            yield runDB_1.postsCollection.insertOne(newPost);
            return {
                id: newPost.id,
                title: newPost.title,
                shortDescription: newPost.shortDescription,
                content: newPost.content,
                blogId: newPost.blogId,
                blogName: newPost.blogName,
                createdAt: newPost.createdAt
            };
        });
    },
    // обновление поста по ID.
    updatePostById(id, title, shortDescription, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateResult = yield runDB_1.postsCollection.updateOne({ id }, { $set: { title, shortDescription, content } });
            return updateResult.matchedCount === 1;
        });
    },
    //поиск ID блога для поста.5
    findBlogIdForPost(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogIdForPost = yield runDB_1.blogsCollection.findOne({ _id: new mongodb_1.ObjectId(blogId) });
            return blogIdForPost ? blogIdForPost : null;
        });
    },
    // поиск и удаление поста по ID.
    postByIdDelete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteResult = yield runDB_1.postsCollection.deleteOne({ id });
            return deleteResult.deletedCount === 1;
        });
    }
};
