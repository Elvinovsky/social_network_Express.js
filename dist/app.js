"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const posts_router_1 = require("./routers/posts-router");
const blogs_router_1 = require("./routers/blogs-router");
const Testing_DB_Delete_router_1 = require("./routers/Testing-DB-Delete-router");
const runDB_1 = require("./database/runDB");
const body_parser_1 = __importDefault(require("body-parser"));
const jsonBodyMiddleware = ( body_parser_1.default)();
exports.app = (express_1.default)();
const port = process.env.PORT || 3499;
exports.app.use(jsonBodyMiddleware);
exports.app.use('/posts', posts_router_1.postsRouter);
exports.app.use('/blogs', blogs_router_1.blogsRouter);
exports.app.use('/testing', Testing_DB_Delete_router_1.deleteAllDataRouter);
const startApp = () => __awaiter(void 0, void 0, void 0, function* () {
    yield ( runDB_1.runDb)();
    exports.app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
});
startApp();
