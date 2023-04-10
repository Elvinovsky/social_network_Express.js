"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postMapping = exports.postsMapping = void 0;
const postsMapping = (array) => {
    return array.map((el) => {
        return {
            id: el._id.toString(),
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
exports.postMapping = ((post) => {
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt
    };
});
