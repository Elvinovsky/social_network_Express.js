"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersMapping = void 0;
const mongodb_1 = require("mongodb");
const usersMapping = (array) => {
    return array.map((el) => {
        return {
            id: new mongodb_1.ObjectId(el._id).toString(),
            login: el.login,
            email: el.email,
            createdAt: el.createdAt
        };
    });
};
exports.usersMapping = usersMapping;
