import {Request, Response, Router} from "express";
import {blogsRepository} from "../repositories/in-memory/blogs-inMemory-repository";
import {postsRepository} from "../repositories/in-memory/posts-inMemory-repository";

export const deleteAllDataRouter = Router();
deleteAllDataRouter.delete('/all-data', async (req: Request, res: Response) => {
    await blogsRepository.testingDeleteAllBlogs()
    await postsRepository.testingDeleteAllPosts()
    res.send(204)
    return;
})