import {
    DeleteResult,
} from "mongodb";
import {
    attemptsCollection,
} from "../../database/runDB";
import { RequestAttempt } from "../../middlewares/rateLimiter";

export const attemptsRepository = {
    //тестовое удаление базы данных
    async testingDeleteAttempts (): Promise<DeleteResult> {
        return await attemptsCollection.deleteMany({})
    },
    async getAttemptsCount ( urlAndIp: string, date: string ) {
        return await attemptsCollection.countDocuments({ urlAndIp, date: { $gte: date } })
    },
    async addNewAttempts ( urlAndIp: string, date: string ) {
        const attempts: RequestAttempt = {
            urlAndIp,
            date
        }
        return await attemptsCollection.insertOne(attempts)
    }
}