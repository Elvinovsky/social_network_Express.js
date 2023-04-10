"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMapping = exports.usersMapping = void 0;
const usersMapping = (array) => {
    return array.map((el) => {
        return {
            id: el._id.toString(),
            login: el.login,
            email: el.email,
            createdAt: el.createdAt
        };
    });
};
exports.usersMapping = usersMapping;
const userMapping = (user) => {
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt
    };
};
exports.userMapping = userMapping;
