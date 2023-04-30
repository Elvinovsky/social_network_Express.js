import express, {Request, Response} from "express";
import {postsRouter} from "./routers/posts-router";
import {blogsRouter} from "./routers/blogs-router";
import {deleteAllDataRouter} from "./routers/Testing-DB-Delete-router";
import {usersRouter} from "./routers/users-router";
import {authRouter} from "./routers/auth-router";
import {feedBacksRouter} from "./routers/feedbacks-router";
import cookieParser from "cookie-parser";
import { securityDevicesRouter } from "./routers/security-devices-router";

const jsonBodyMiddleware = express.json()
const app = express()

app.use(jsonBodyMiddleware)
app.use(cookieParser())

app.set('trust proxy', true)
app.get('/', (req:Request, res:Response) => {
    const ipAddress = req.ip
    res.send({ipAddress})
})
app.use('/users', usersRouter)
app.use('/auth', authRouter)
app.use('/posts', postsRouter)
app.use('/blogs', blogsRouter)
app.use('/comments', feedBacksRouter)
app.use('/security', securityDevicesRouter)
app.use('/testing', deleteAllDataRouter)

const startServer = () => {
    const port = process.env.PORT || 3007
    app.listen(port, () => {
            console.log(`Example app listening on port ${port}`)
    })
}

export { app, startServer }




