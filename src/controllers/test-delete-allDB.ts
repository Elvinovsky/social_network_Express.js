import {
    Request,
    Response
} from "express";
import { blogsRepository } from "../repositories/db/blogs-db-repository";
import { postsRepository } from "../repositories/db/posts-db-repository";
import { usersRepository } from "../repositories/db/users-db-repository";
import { DevicesSessionsRepository } from "../repositories/db/devices-sessions-repository";
import { attemptsRepository } from "../repositories/db/attempts-db-repository";
import { LikesInfoRepo } from "../repositories/db/likesInfo-db-repository";
import { FeedbacksDbRepository } from "../repositories/db/feedbacks-db-repository";
import {
    inject,
    injectable
} from "inversify";

@injectable()
export class TestDeleteAllDBController {

    constructor ( @inject(DevicesSessionsRepository) protected devicesRepository: DevicesSessionsRepository, @inject(FeedbacksDbRepository) protected feedBacksRepository: FeedbacksDbRepository, @inject(LikesInfoRepo) protected likesInfoRepo: LikesInfoRepo) {
    }

    async delete ( req: Request, res: Response ) {
        await blogsRepository.testingDeleteAllBlogs()
        await postsRepository.testingDeleteAllPosts()
        await usersRepository.testingDeleteAllUsers()
        await this.feedBacksRepository.testingDeleteAllComments()
        await this.devicesRepository.testingDeleteAllSessions()
        await attemptsRepository.testingDeleteAttempts()
        await this.likesInfoRepo.testDeleteDb()
        res.sendStatus(204)
        return;
    }
}
