"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filter = void 0;
const filter = (searchNameTerm) => {
    return searchNameTerm
        ? { name: { $regex: 'searchNameTerm', $options: 'i' } }
        : {};
};
exports.filter = filter;
