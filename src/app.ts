import express, {Request, Response} from "express";
import {postsRouter} from "./routers/posts-router";
import {blogsRouter} from "./routers/blogs-router";
import {deleteAllDataRouter} from "./routers/Testing-DB-Delete-router";
import {usersRouter} from "./routers/users-router";
import {authRouter} from "./routers/auth-router";
import {feedBacksRouter} from "./routers/feedbacks-router";
import ip from 'ip';
import cookieParser from "cookie-parser";

const jsonBodyMiddleware = express.json()
const app = express()

app.use(jsonBodyMiddleware)
app.use(cookieParser())

app.get('/', (req:Request, res:Response) => {
    const ipAddress = ip.address()
    res.send({ipAddress})
})
app.use('/users', usersRouter)
app.use('/auth', authRouter)
app.use('/posts', postsRouter)
app.use('/blogs', blogsRouter)
app.use('/comments', feedBacksRouter)
app.use('/testing', deleteAllDataRouter)

const startServer = () => {
    const port = process.env.PORT || 3007
    app.listen(port, () => {
            console.log(`Example app listening on port ${port}`)
    })
}

export { app, startServer }




