"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const posts_router_1 = require("./routers/posts-router");
const blogs_router_1 = require("./routers/blogs-router");
const Testing_DB_Delete_router_1 = require("./routers/Testing-DB-Delete-router");
const users_router_1 = require("./routers/users-router");
const jsonBodyMiddleware = express_1.default.json();
const app = (0, express_1.default)();
exports.app = app;
app.use(jsonBodyMiddleware);
app.get('/', (req, res) => {
    res.send('Hello World!!');
});
app.use('/posts', posts_router_1.postsRouter);
app.use('/blogs', blogs_router_1.blogsRouter);
app.use('/users', users_router_1.usersRouter);
app.use('/testing', Testing_DB_Delete_router_1.deleteAllDataRouter);
const startServer = () => {
    const port = process.env.PORT || 3005;
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
};
exports.startServer = startServer;
