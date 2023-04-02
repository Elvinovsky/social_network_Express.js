"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockMongo_Id = exports.filterLoginOrEmail = exports.filterName = exports.filterTitle = void 0;
const filterTitle = (searchTitleTerm) => {
    return searchTitleTerm ? { title: { $regex: searchTitleTerm, $options: 'i' } }
        : {};
};
exports.filterTitle = filterTitle;
exports.filterName = {};
const filterLoginOrEmail = (searchEmailTerm, searchLoginTerm) => {
    return searchLoginTerm && searchEmailTerm
        ? { $and: [{ login: { $regex: searchLoginTerm, $options: 'i' } }, { email: { $regex: searchEmailTerm, $options: 'i' } }] }
        : searchLoginTerm ?
            { login: { $regex: searchLoginTerm, $options: 'i' } }
            : searchEmailTerm ?
                { email: { $regex: searchEmailTerm, $options: 'i' } }
                : {};
};
exports.filterLoginOrEmail = filterLoginOrEmail;
exports.blockMongo_Id = { projection: { _id: 0 } };
