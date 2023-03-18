import express from 'express'
import {postsRouter} from "./routers/posts-router";
import {blogsRouter} from "./routers/blogs-router";
import {deleteAllDataRouter} from "./routers/Testing-Delete-router";
import {jsonBodyMiddleware} from "./middlewares/jsonBody-middleware";

const app = express()
const port = 3070

app.use(jsonBodyMiddleware)

app.use('/posts', postsRouter)
app.use('/blogs', blogsRouter)
app.use('/testing', deleteAllDataRouter)
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

