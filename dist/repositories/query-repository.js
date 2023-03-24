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
exports.queryRepository = void 0;
const runDB_1 = require("../database/runDB");
exports.queryRepository = {
    returnOfAllBlogs(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return name ? yield runDB_1.blogsCollection.find({ name: { $regex: name } }, { projection: { _id: 0 } }).toArray()
                : yield runDB_1.blogsCollection.find({}, { projection: { _id: 0 } }).toArray();
        });
    },
    findBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield runDB_1.blogsCollection.findOne({ id }, { projection: { _id: 0 } });
        });
    },
    searchPostByBlogId(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield runDB_1.postsCollection.find({ blogId: blogId }).toArray();
        });
    },
    returnOfAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield runDB_1.postsCollection.find({}, { projection: { _id: 0 } }).toArray();
        });
    },
    findPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield runDB_1.postsCollection.findOne({ id }, { projection: { _id: 0 } });
        });
    },
};
