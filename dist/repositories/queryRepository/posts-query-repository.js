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
exports.postQueryRepository = void 0;
const runDB_1 = require("../../database/runDB");
const postMapping_1 = require("../../functions/postMapping");
const posts_helpers_1 = require("../../helpers/posts-helpers");
exports.postQueryRepository = {
    returnOfAllPosts(searchTitleTerm, pageNumber, pageSize, sortBy, sortDirection) {
        return __awaiter(this, void 0, void 0, function* () {
            const mongoPageNumber = pageNumber ? +pageNumber : 1;
            const mongoPageSize = pageSize ? +pageSize : 10;
            const mongoSortBy = sortBy ? sortBy : "createdAt";
            const mongoSortDirection = sortDirection ? (sortDirection === 'asc' ? 1 : -1) : -1;
            const mongoPostsToSkip = (+mongoPageNumber - 1) * +mongoPageSize;
            const numberOfFiles = yield runDB_1.postsCollection.countDocuments(searchTitleTerm ? { title: { $regex: searchTitleTerm, $options: "i" } } : {});
            const pagesCountOfPosts = Math.ceil(numberOfFiles / mongoPageSize);
            if (searchTitleTerm) {
                const foundPostsTitle = yield runDB_1.postsCollection
                    .find({ title: { $regex: searchTitleTerm, $options: "i" } }, posts_helpers_1.blockMongo_Id)
                    .sort({ [mongoSortBy]: mongoSortDirection, createdAt: mongoSortDirection })
                    .skip(mongoPostsToSkip)
                    .limit(+mongoPageSize).toArray();
                return {
                    pagesCount: pagesCountOfPosts,
                    page: mongoPageNumber,
                    pageSize: mongoPageSize,
                    totalCount: numberOfFiles,
                    items: (0, postMapping_1.postMapping)(foundPostsTitle)
                };
            }
            const foundPosts = yield runDB_1.postsCollection
                .find({}, posts_helpers_1.blockMongo_Id)
                .sort({ [mongoSortBy]: mongoSortDirection, createdAt: mongoSortDirection })
                .skip(mongoPostsToSkip)
                .limit(mongoPageSize).toArray();
            return {
                pagesCount: pagesCountOfPosts,
                page: mongoPageNumber,
                pageSize: mongoPageSize,
                totalCount: numberOfFiles,
                items: (0, postMapping_1.postMapping)(foundPosts)
            };
        });
    },
    findPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield runDB_1.postsCollection.findOne({ id }, posts_helpers_1.blockMongo_Id);
        });
    },
};
