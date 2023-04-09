"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsMapping = void 0;
const commentsMapping = (array) => {
    return array.map((el) => {
        return {
            id: el._id.toString(),
            content: el.content,
            commentatorInfo: {
                userId: el.commentatorInfo.userId,
                userLogin: el.commentatorInfo.userLogin
            },
            createdAt: el.createdAt
        };
    });
};
exports.commentsMapping = commentsMapping;
