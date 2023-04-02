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
exports.usersQueryRepository = void 0;
const pagination_helpers_1 = require("../../helpers/pagination-helpers");
const filters_1 = require("../../functions/filters");
const runDB_1 = require("../../database/runDB");
const usersMapping_1 = require("../../functions/usersMapping");
exports.usersQueryRepository = {
    returnOfAllUsers(searchEmailTerm, searchLoginTerm, pageNumber, pageSize, sortBy, sortDirection) {
        return __awaiter(this, void 0, void 0, function* () {
            const calculateOfFiles = yield runDB_1.usersCollection.countDocuments((0, filters_1.filterLoginOrEmail)(searchEmailTerm, searchLoginTerm));
            const foundUsers = yield runDB_1.usersCollection
                .find((0, filters_1.filterLoginOrEmail)(searchEmailTerm, searchLoginTerm), filters_1.blockMongo_Id)
                .sort({ [(0, pagination_helpers_1.getMongoSortBy)(sortBy)]: (0, pagination_helpers_1.getMongoSortDirection)(sortDirection), createdAt: (0, pagination_helpers_1.getMongoSortDirection)(sortDirection) })
                .skip((0, pagination_helpers_1.getMongoSkip)((0, pagination_helpers_1.getMongoPageNumber)(pageNumber), (0, pagination_helpers_1.getMongoPageSize)(pageSize)))
                .limit((0, pagination_helpers_1.getMongoPageSize)(pageSize)).toArray();
            return {
                pagesCount: (0, pagination_helpers_1.pagesCountOfBlogs)(calculateOfFiles, pageSize),
                page: (0, pagination_helpers_1.getMongoPageNumber)(pageNumber),
                pageSize: (0, pagination_helpers_1.getMongoPageSize)(pageSize),
                totalCount: calculateOfFiles,
                items: (0, usersMapping_1.usersMapping)(foundUsers)
            };
        });
    },
};
