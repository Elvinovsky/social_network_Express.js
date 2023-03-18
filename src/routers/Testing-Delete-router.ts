import {Request, Response, Router} from "express";
import {blogsRepository} from "../repositories/blogs-repository";
import {postsRepository} from "../repositories/posts-repository";

export const deleteAllDataRouter = Router();
deleteAllDataRouter.delete('/all-data', (req: Request, res: Response) => {
    blogsRepository.testingDeleteAllBlogs()
    postsRepository.testingDeleteAllPosts()
    res.send(204)
})