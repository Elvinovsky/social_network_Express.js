import {
    DeleteResult,
} from "mongodb";
import {
    attemptsCollection,
} from "../../database/runDB";

export const attemptsRepository = {
    //тестовое удаление базы данных
    async testingDeleteAttempts (): Promise<DeleteResult> {
        return await attemptsCollection.deleteMany({})
    },
    async getAttemptsCount ( urlAndIp: string, date: string ) {
        return await attemptsCollection.countDocuments({ urlAndIp: { $gte: date } })
    },
    async addNewAttempts ( urlAndIp: string, date: string ) {
        const attempts = {
            urlAndIp,
            date
        }
        return await attemptsCollection.insertOne(attempts)
    }
}