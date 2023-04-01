"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pagesCountOfBlogs = exports.getMongoSkip = exports.getMongoSortDirection = exports.getMongoSortBy = exports.getMongoPageSize = exports.getMongoPageNumber = void 0;
const getMongoPageNumber = (pageNumber) => {
    return pageNumber ? +pageNumber : 1;
};
exports.getMongoPageNumber = getMongoPageNumber;
const getMongoPageSize = (pageSize) => {
    return pageSize ? +pageSize : 10;
};
exports.getMongoPageSize = getMongoPageSize;
const getMongoSortBy = (sortBy) => {
    return sortBy ? sortBy : 'createdAt';
};
exports.getMongoSortBy = getMongoSortBy;
const getMongoSortDirection = (sortDirection) => {
    return sortDirection === 'asc' ? 1 : -1;
};
exports.getMongoSortDirection = getMongoSortDirection;
const getMongoSkip = (pageNumber, pageSize) => {
    return (+pageNumber - 1) * +pageSize;
};
exports.getMongoSkip = getMongoSkip;
const pagesCountOfBlogs = (calculateOfFiles, pageSize) => {
    return Math.ceil(calculateOfFiles / (0, exports.getMongoPageSize)(pageSize));
};
exports.pagesCountOfBlogs = pagesCountOfBlogs;
