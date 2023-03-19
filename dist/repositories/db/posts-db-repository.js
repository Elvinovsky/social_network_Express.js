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
exports.postsRepository = {
    // тестовое удаление базы данных Постов
    testingDeleteAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield runDB_1.client.db('db').collection('posts').deleteMany();
        });
    },
    // все существующие посты.
    returnOfAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield runDB_1.client.db('db').collection('posts').find({}).toArray();
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
            yield runDB_1.client.db('db').collection('posts').insertOne(createNewPost);
            return createNewPost;
        });
    },
    //поиск поста по ID.
    findPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield runDB_1.client.db('db').collection('posts').findOne({ id });
            if (post) {
                return post;
            }
            else {
                return undefined;
            }
        });
    },
    // обновление поста по ID.
    updatePostById(id, title, shortDescription, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateResult = yield runDB_1.client.db('db').collection('posts').updateOne({ id }, { $set: { title, shortDescription, content } });
            return updateResult.matchedCount === 1;
        });
    },
    //поиск ID блога для поста.
    searchBlogIdForPost(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogIdForPost = yield runDB_1.client.db('db').collection('blogs').findOne({ id: blogId });
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
            const deleteResult = yield runDB_1.client.db('db').collection('posts').deleteOne({ id });
            return deleteResult.deletedCount === 1;
        });
    }
};
