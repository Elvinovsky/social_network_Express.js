"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersMapping = void 0;
const usersMapping = (array) => {
    return array.map((el) => {
        return {
            login: el.login,
            password: el.password,
            email: el.email,
            createdAt: el.createdAt
        };
    });
};
exports.usersMapping = usersMapping;
