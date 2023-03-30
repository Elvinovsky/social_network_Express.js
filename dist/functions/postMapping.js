"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postMapping = void 0;
const postMapping = (array) => {
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
exports.postMapping = postMapping;
