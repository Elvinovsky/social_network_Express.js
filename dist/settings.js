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
exports.startServer = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const posts_router_1 = require("./routers/posts-router");
const blogs_router_1 = require("./routers/blogs-router");
const Testing_DB_Delete_router_1 = require("./routers/Testing-DB-Delete-router");
const jsonBodyMiddleware = express_1.default.json();
const app = (0, express_1.default)();
exports.app = app;
app.use(jsonBodyMiddleware);
app.get('/', (req, res) => {
    res.send('Hello World!!');
});
app.use('/posts', posts_router_1.postsRouter);
app.use('/blogs', blogs_router_1.blogsRouter);
app.use('/testing', Testing_DB_Delete_router_1.deleteAllDataRouter);
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const port = process.env.PORT || 3999;
    try {
        yield app.listen(port, () => {
            console.log(`Example app listening on port ${port}`);
        });
    }
    catch (_a) {
        console.log(`not connect`);
    }
});
exports.startServer = startServer;
