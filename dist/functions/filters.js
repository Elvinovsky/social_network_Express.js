"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockMongo_Id = exports.filterLoginOrEmail = void 0;
const filterLoginOrEmail = (searchEmailTerm, searchLoginTerm) => {
    return searchLoginTerm || searchEmailTerm
        ? { $or: [{ login: { $regex: searchLoginTerm, $options: 'i' } }, { email: { $regex: searchEmailTerm, $options: 'i' } }] }
        : {};
};
exports.filterLoginOrEmail = filterLoginOrEmail;
exports.blockMongo_Id = { projection: { _id: 0 } };
