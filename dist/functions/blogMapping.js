"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogMapping = void 0;
const blogMapping = (array) => {
    return array.map((el) => {
        return {
            id: el._id.toString(),
            name: el.name,
            description: el.description,
            websiteUrl: el.websiteUrl,
            createdAt: el.createdAt,
            isMembership: el.isMembership
        };
    });
};
exports.blogMapping = blogMapping;
