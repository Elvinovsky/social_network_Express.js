import {
    DeleteResult,
} from "mongodb";
import { AttemptModelClass } from "../../models/mongoose/models";
import { RequestAttempt } from "../../models/mongoose/schemas";

export const attemptsRepository = {
    //тестовое удаление базы данных
    async testingDeleteAttempts (): Promise<DeleteResult> {
        return await AttemptModelClass.deleteMany({})
    },
    async getAttemptsCount ( urlAndIp: string, date: string ) {
        return await AttemptModelClass.countDocuments({
            urlAndIp,
            date: { $gte: date }
        })
    },
    async addNewAttempts ( attempts: RequestAttempt ) {
        return await AttemptModelClass.create(attempts)
    }
}