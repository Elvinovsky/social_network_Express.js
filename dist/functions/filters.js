"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterLoginOrEmail = void 0;
const filterLoginOrEmail = (searchEmailTerm, searchLoginTerm) => {
    return (searchLoginTerm || searchEmailTerm)
        ? { $or: [{ login: { $regex: searchLoginTerm, $options: 'i' } }, { email: { $regex: searchEmailTerm, $options: 'i' } }] }
        : {};
};
exports.filterLoginOrEmail = filterLoginOrEmail;
