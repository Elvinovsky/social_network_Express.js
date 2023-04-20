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
const auth_router_1 = require("./routers/auth-router");
const feedbacks_router_1 = require("./routers/feedbacks-router");
const ip_1 = __importDefault(require("ip"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const jsonBodyMiddleware = express_1.default.json();
const app = (0, express_1.default)();
exports.app = app;
app.use(jsonBodyMiddleware);
app.use((0, cookie_parser_1.default)());
app.get('/', (req, res) => {
    const ipAddress = ip_1.default.address();
    res.send({ ipAddress });
});
app.use('/users', users_router_1.usersRouter);
app.use('/auth', auth_router_1.authRouter);
app.use('/posts', posts_router_1.postsRouter);
app.use('/blogs', blogs_router_1.blogsRouter);
app.use('/comments', feedbacks_router_1.feedBacksRouter);
app.use('/testing', Testing_DB_Delete_router_1.deleteAllDataRouter);
const startServer = () => {
    const port = process.env.PORT || 3007;
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
};
exports.startServer = startServer;
