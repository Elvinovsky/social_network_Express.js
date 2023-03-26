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
const blogMapping_1 = require("../functions/blogMapping");
const postMapping_1 = require("../functions/postMapping");
const blockMongo_Id = { projection: { _id: 0 } };
exports.queryRepository = {
    returnOfAllBlogs(searchNameTerm, pageNumber, pageSize, sortBy, sortDirection) {
        return __awaiter(this, void 0, void 0, function* () {
            const mongoPageNumber = pageNumber || 1;
            const mongoPageSize = pageSize || 10;
            const mongoSortBy = sortBy || 'createdAt';
            const mongoSortDirection = sortDirection === 'asc' ? 1 : -1;
            const mongoBlogsToSkip = (mongoPageNumber - 1) * mongoPageSize;
            const numberOfFiles = yield runDB_1.postsCollection.countDocuments();
            const pagesCountOfPosts = Math.ceil(numberOfFiles / mongoPageSize);
            const foundBlogsName = yield runDB_1.blogsCollection
                .find({ name: { $regex: searchNameTerm, $options: "i" } }, blockMongo_Id)
                .sort({ [mongoSortBy]: mongoSortDirection })
                .skip(mongoBlogsToSkip)
                .limit(mongoPageSize).toArray();
            const foundBlogs = yield runDB_1.blogsCollection
                .find({}, blockMongo_Id)
                .sort({ [mongoSortBy]: mongoSortDirection })
                .skip(mongoBlogsToSkip)
                .limit(mongoPageSize).toArray();
            return {
                pagesCount: pagesCountOfPosts,
                page: mongoPageNumber,
                pageSize: mongoPageSize,
                totalCount: numberOfFiles,
                items: searchNameTerm ? (0, blogMapping_1.blogMapping)(foundBlogsName) : (0, blogMapping_1.blogMapping)(foundBlogs)
            };
        });
    },
    findBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield runDB_1.blogsCollection.findOne({ id }, blockMongo_Id);
        });
    },
    searchPostByBlogId(blogId, pageNumber, pageSize, sortBy, sortDirection) {
        return __awaiter(this, void 0, void 0, function* () {
            const mongoPageNumber = pageNumber || 1;
            const mongoPageSize = pageSize || 10;
            const mongoSortBy = sortBy || 'createdAt';
            const mongoSortDirection = sortDirection === 'asc' ? 1 : -1;
            const mongoPostsToSkip = (mongoPageNumber - 1) * mongoPageSize;
            const numberOfFiles = yield runDB_1.postsCollection.countDocuments({ blogId });
            const pagesCountOfPosts = Math.ceil(numberOfFiles / mongoPageSize);
            const foundBlogs = yield runDB_1.postsCollection
                .find({ blogId: blogId })
                .sort({ [mongoSortBy]: mongoSortDirection })
                .skip(mongoPostsToSkip)
                .limit(mongoPageSize).toArray();
            return {
                pagesCount: pagesCountOfPosts,
                page: mongoPageNumber,
                pageSize: mongoPageSize,
                totalCount: numberOfFiles,
                items: (0, postMapping_1.postMapping)(foundBlogs)
            };
        });
    },
    returnOfAllPosts(searchTitleTerm, pageNumber, pageSize, sortBy, sortDirection) {
        return __awaiter(this, void 0, void 0, function* () {
            const mongoPageNumber = pageNumber || 1;
            const mongoPageSize = pageSize || 10;
            const mongoSortBy = sortBy || 'createdAt';
            const mongoSortDirection = sortDirection === 'asc' ? 1 : -1;
            const mongoPostsToSkip = (mongoPageNumber - 1) * mongoPageSize;
            const numberOfFiles = yield runDB_1.postsCollection.countDocuments(searchTitleTerm ? { searchTitleTerm } : {});
            const pagesCountOfPosts = Math.ceil(numberOfFiles / mongoPageSize);
            const foundPostsTitle = yield runDB_1.postsCollection
                .find({ title: { $regex: searchTitleTerm, $options: "i" } }, blockMongo_Id)
                .sort({ [mongoSortBy]: mongoSortDirection })
                .skip(mongoPostsToSkip)
                .limit(mongoPageSize).toArray();
            const foundPosts = yield runDB_1.postsCollection
                .find({}, blockMongo_Id)
                .sort({ [mongoSortBy]: mongoSortDirection })
                .skip(mongoPostsToSkip)
                .limit(mongoPageSize).toArray();
            return {
                pagesCount: pagesCountOfPosts,
                page: mongoPageNumber,
                pageSize: mongoPageSize,
                totalCount: numberOfFiles,
                items: searchTitleTerm ? (0, postMapping_1.postMapping)(foundPostsTitle) : (0, postMapping_1.postMapping)(foundPosts)
            };
        });
    },
    findPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield runDB_1.postsCollection.findOne({ id }, blockMongo_Id);
        });
    },
};
