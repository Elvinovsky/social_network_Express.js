"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterName = exports.filterTitle = void 0;
const filterTitle = (searchTerm) => {
    return searchTerm
        ? { title: { $regex: searchTerm, $options: 'i' } }
        : {};
};
exports.filterTitle = filterTitle;
const filterName = (searchTerm) => {
    return searchTerm
        ? { name: { $regex: searchTerm, $options: 'i' } }
        : {};
};
exports.filterName = filterName;
