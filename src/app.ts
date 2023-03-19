import express from 'express'
import {postsRouter} from "./routers/posts-router";
import {blogsRouter} from "./routers/blogs-router";
import {deleteAllDataRouter} from "./routers/Testing-DB-Delete-router";
import {jsonBodyMiddleware} from "./middlewares/jsonBody-middleware";
import {runDb} from "./database/runDB";

const app = express()
const port = process.env.PORT || 3070

app.use(jsonBodyMiddleware)

app.use('/posts', postsRouter)
app.use('/blogs', blogsRouter)
app.use('/testing', deleteAllDataRouter)

const startApp = async () => {
    await runDb()
    app.listen(port, () => {
       console.log(`Example app listening on port ${port}`)
    })
}

startApp()
