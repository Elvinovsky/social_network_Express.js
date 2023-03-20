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
exports.blogsRepository = void 0;
const runDB_1 = require("../../database/runDB");
exports.blogsRepository = {
    //тестовое удаление базы данных о блогах.
    testingDeleteAllBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield runDB_1.client.db('db').collection('blogs').deleteMany({});
        });
    },
    //все существующие блоги.
    returnOfAllBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield runDB_1.client.db('db').collection('blogs').find({}, { projection: { _id: 0 } }).toArray();
        });
    },
    //создание и добавление нового блога.
    addNewBlog(name, description, websiteUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const createBlog = {
                id: (+(new Date())).toString(),
                name: name,
                description: description,
                websiteUrl: websiteUrl,
                createdAt: new Date().toISOString(),
                isMembership: false
            };
            yield runDB_1.client.db('db').collection('blogs').insertOne(createBlog);
            return {
                id: createBlog.id,
                name: createBlog.name,
                description: createBlog.description,
                websiteUrl: createBlog.websiteUrl,
                createdAt: createBlog.createdAt,
                isMembership: createBlog.isMembership
            };
        });
    },
    //поиск и возврат блога по ID.
    findBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield runDB_1.client.db('db').collection('blogs').findOne({ id }, { projection: { _id: 0 } });
            if (blog) {
                return blog;
            }
            else {
                return undefined;
            }
        });
    },
    //обновление блога по айди.
    updateBlogById(id, name, description, websiteUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield runDB_1.client.db('db').collection('blogs').updateOne({ id }, { $set: { name, description, websiteUrl } });
            return result.matchedCount === 1;
        });
    },
    //поиск блога по ID для удаления.
    searchBlogByIdDelete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteResult = yield runDB_1.client.db('db').collection('blogs').deleteOne({ id });
            return deleteResult.deletedCount === 1;
        });
    }
};
