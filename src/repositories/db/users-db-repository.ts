import { usersCollection } from "../../database/runDB";
import { UserAccountDBModel } from "../../models/modelsUsersLogin/user-input";
import {
    DeleteResult,
    ObjectId,
    WithId
} from "mongodb";
import { UserViewModel } from "../../models/modelsUsersLogin/user-view";


export const usersRepository = {
    async testingDeleteAllUsers (): Promise<DeleteResult> {
        return await usersCollection.deleteMany({})
    },
    async findUserById ( id: string ): Promise<WithId<UserAccountDBModel> | null> {
        return await usersCollection.findOne({ _id: new ObjectId(id) })
    },
    async findUserConfirmCode ( code: string ): Promise<WithId<UserAccountDBModel> | null> {
        return await usersCollection.findOne({ "emailConfirmation.confirmationCode": code })
    },
    async updateConfirmCode ( code: string ): Promise<boolean> {
        const updateResult = await usersCollection.updateOne(
            { "emailConfirmation.confirmationCode": code },
            { $set: { "emailConfirmation.isConfirmed": true } })
        return updateResult.matchedCount === 1
    },
    async updatePasswordHash (passwordHash: string, code: string):Promise<boolean | null> {
        const isOneUser = await usersCollection. find( // todo вынести в сервис
            {"emailConfirmation.confirmationCode": code}
        ).toArray()
        if (isOneUser.length !== 1) { // проверяем код подверждения на совпадения, чтобы не сменить пароль другому юзеру
            return null
        }
        const updateResult = await usersCollection.updateOne(
            {"emailConfirmation.confirmationCode": code},
            {$set: { passwordHash: passwordHash}}
        )
        return updateResult.matchedCount === 1
    },
    async updateConfirmationCodeByEmail ( email: string, code: string ): Promise<boolean> {
        const updateResult = await usersCollection.updateOne({ email },
            { $set: { "emailConfirmation.confirmationCode": code } })
        return updateResult.matchedCount === 1
    },
    async findUserForComment ( userId: string ): Promise<WithId<UserAccountDBModel> | null> {
        return await usersCollection.findOne({ _id: new ObjectId(userId) })
    },
    async findByLoginOrEmail ( loginOrEmail: string ): Promise<WithId<UserAccountDBModel> | null> {
        return await usersCollection.findOne({ $or: [{ login: loginOrEmail }, { email: loginOrEmail }] })
    },
    async addNewUser ( newUser: UserAccountDBModel ): Promise<UserViewModel> {
        const result = await usersCollection.insertOne(newUser)
        return {
            id: result.insertedId.toString(),
            login: newUser.login,
            email: newUser.email,
            createdAt: newUser.createdAt
        }
    },
    async userByIdDelete ( id: string ): Promise<boolean> {
        const deleteResult = await usersCollection.deleteOne({ _id: new ObjectId(id) })
        return deleteResult.deletedCount === 1
    },
}