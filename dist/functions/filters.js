"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterName = exports.filterTitle = void 0;
const filterTitle = (searchTitleTerm) => {
    return searchTitleTerm
        ? { title: { $regex: searchTitleTerm, $options: 'i' } }
        : {};
};
exports.filterTitle = filterTitle;
const filterName = (searchNameTerm) => {
    return searchNameTerm
        ? { name: { $regex: searchNameTerm, $options: 'i' } }
        : {};
};
exports.filterName = filterName;
