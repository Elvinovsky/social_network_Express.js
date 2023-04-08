"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pagesCountOfBlogs = exports.getSkip = exports.getDirection = exports.getSortBy = exports.getPageSize = exports.getPageNumber = exports.DEFAULT_PAGE_SortBy = exports.SortDirection = void 0;
var SortDirection;
(function (SortDirection) {
    SortDirection[SortDirection["Asc"] = 1] = "Asc";
    SortDirection[SortDirection["Desc"] = -1] = "Desc";
})(SortDirection = exports.SortDirection || (exports.SortDirection = {}));
exports.DEFAULT_PAGE_SortBy = 'createdAt';
const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 10;
const getPageNumber = (pageNumber) => {
    return pageNumber ? +pageNumber : DEFAULT_PAGE_NUMBER;
};
exports.getPageNumber = getPageNumber;
const getPageSize = (pageSize) => {
    return pageSize ? +pageSize : DEFAULT_PAGE_SIZE;
};
exports.getPageSize = getPageSize;
const getSortBy = (sortBy) => {
    return sortBy ? sortBy : exports.DEFAULT_PAGE_SortBy;
};
exports.getSortBy = getSortBy;
const getDirection = (sortDirection) => {
    return sortDirection === 'asc' ? SortDirection.Asc : SortDirection.Desc;
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
