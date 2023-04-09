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
const mongodb_1 = require("mongodb");
function blogMapping(blog) {
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership
    };
}
exports.blogsRepository = {
    //тестовое удаление базы данных о блогах.
    testingDeleteAllBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield runDB_1.blogsCollection.deleteMany({});
        });
    },
    //поиск блога по ID.
    findBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield runDB_1.blogsCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (!blog) {
                return null;
            }
            return blogMapping(blog);
        });
    },
    //создание и добавление нового блога.
    addNewBlog(createBlog) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield runDB_1.blogsCollection.insertOne(createBlog);
            return {
                id: result.insertedId.toString(),
                name: createBlog.name,
                description: createBlog.description,
                websiteUrl: createBlog.websiteUrl,
                createdAt: createBlog.createdAt,
                isMembership: createBlog.isMembership
            };
        });
    },
    //обновление блога по айди.
    updateBlogById(id, name, description, websiteUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield runDB_1.blogsCollection.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: { name, description, websiteUrl } });
            return result.matchedCount === 1;
        });
    },
    //поиск блога по ID для удаления.
    searchBlogByIdDelete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteResult = yield runDB_1.blogsCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
            return deleteResult.deletedCount === 1;
        });
    }
};
