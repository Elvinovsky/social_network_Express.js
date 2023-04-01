"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockMongo_Id = exports.filterLoginOrEmail = exports.filterName = exports.filterTitle = void 0;
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
const filterLoginOrEmail = (searchEmailTerm, searchLoginTerm) => {
    return searchLoginTerm
        ? { login: { $regex: searchLoginTerm, $options: 'i' } }
        : searchEmailTerm ?
            { email: { $regex: searchEmailTerm, $options: 'i' } }
            : {};
};
exports.filterLoginOrEmail = filterLoginOrEmail;
exports.blockMongo_Id = { projection: { _id: 0 } };
