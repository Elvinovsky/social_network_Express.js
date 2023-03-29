"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const posts_router_1 = require("./routers/posts-router");
const blogs_router_1 = require("./routers/blogs-router");
const Testing_DB_Delete_router_1 = require("./routers/Testing-DB-Delete-router");
const body_parser_1 = __importDefault(require("body-parser"));
const jsonBodyMiddleware = (0, body_parser_1.default)();
exports.app = (0, express_1.default)();
exports.app.use(jsonBodyMiddleware);
exports.app.get('/', (req, res) => {
    res.send('Hello World!!');
});
exports.app.use('/posts', posts_router_1.postsRouter);
exports.app.use('/blogs', blogs_router_1.blogsRouter);
exports.app.use('/testing', Testing_DB_Delete_router_1.deleteAllDataRouter);
