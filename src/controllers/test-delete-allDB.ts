import {
    Request,
    Response
} from "express";
import { blogsRepository } from "../repositories/db/blogs-db-repository";
import { postsRepository } from "../repositories/db/posts-db-repository";
import { usersRepository } from "../repositories/db/users-db-repository";
import { feedBacksRepository } from "../repositories/db/feedbacks-db-repository";
import { DevicesSessionsRepository } from "../repositories/db/devices-sessions-repository";
import { attemptsRepository } from "../repositories/db/attempts-db-repository";

class TestDeleteAllDBController {
    private devicesRepository: DevicesSessionsRepository

    constructor () {
        this.devicesRepository = new DevicesSessionsRepository()
    }

    async delete ( req: Request, res: Response ) {
        await blogsRepository.testingDeleteAllBlogs()
        await postsRepository.testingDeleteAllPosts()
        await usersRepository.testingDeleteAllUsers()
        await feedBacksRepository.testingDeleteAllComments()
        await this.devicesRepository.testingDeleteAllSessions()
        await attemptsRepository.testingDeleteAttempts()
        res.sendStatus(204)
        return;
    }
}

export const deleteAllDBController = new TestDeleteAllDBController()