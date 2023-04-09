"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsMapping = void 0;
const postsMapping = (array) => {
    return array.map((el) => {
        return {
            id: el.id,
            title: el.title,
            shortDescription: el.shortDescription,
            content: el.content,
            blogId: el.blogId,
            blogName: el.blogName,
            createdAt: el.createdAt
        };
    });
};
exports.postsMapping = postsMapping;
