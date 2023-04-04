"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pagesCountOfBlogs = exports.getSkip = exports.getDirection = exports.getSortBy = exports.getPageSize = exports.getPageNumber = void 0;
const getPageNumber = (pageNumber) => {
    return pageNumber ? +pageNumber : 1;
};
exports.getPageNumber = getPageNumber;
const getPageSize = (pageSize) => {
    return pageSize ? +pageSize : 10;
};
exports.getPageSize = getPageSize;
const getSortBy = (sortBy) => {
    return sortBy ? sortBy : 'createdAt';
};
exports.getSortBy = getSortBy;
const getDirection = (sortDirection) => {
    return sortDirection === 'asc' ? 1 : -1;
};
exports.getDirection = getDirection;
const getSkip = (pageNumber = 1, pageSize = 10) => {
    return (+pageNumber - 1) * +pageSize;
};
exports.getSkip = getSkip;
const pagesCountOfBlogs = (calculateOfFiles, pageSize) => {
    return Math.ceil(calculateOfFiles / (0, exports.getPageSize)(pageSize));
};
exports.pagesCountOfBlogs = pagesCountOfBlogs;
