import {Request, Response, Router} from "express";
import {blogsRepository} from "../repositories/db/blogs-db-repository";
import {postsRepository} from "../repositories/db/posts-db-repository";
import {usersRepository} from "../repositories/db/users-db-repository";
import {feedBacksRepository} from "../repositories/db/feedbacks-db-repository";
import {devicesSessionsRepository} from "../repositories/db/devices-sessions-repository";
import { attemptsRepository } from "../repositories/db/attempts-db-repository";

export const deleteAllDataRouter = Router();

deleteAllDataRouter.delete('/all-data', async (req: Request, res: Response) => {
    await blogsRepository.testingDeleteAllBlogs()
    await postsRepository.testingDeleteAllPosts()
    await usersRepository.testingDeleteAllUsers()
    await feedBacksRepository.testingDeleteAllComments()
    await devicesSessionsRepository.testingDeleteAllSessions()
    await attemptsRepository.testingDeleteAttempts()
    res.send(204)
    return;
})