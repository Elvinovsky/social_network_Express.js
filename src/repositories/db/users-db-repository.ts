import {usersCollection} from "../../database/runDB";
import { UserAccountDBModel} from "../../models/modelsUsersLogin/user-input";
import {DeleteResult, ObjectId, WithId} from "mongodb";
import {UserViewModel} from "../../models/modelsUsersLogin/user-view";
import {userMapping} from "../../functions/usersMapping";


export const usersRepository = {
    async testingDeleteAllUsers(): Promise< DeleteResult > {
        return await usersCollection.deleteMany({})
    },
    async findUserById(id: string):  Promise< UserViewModel | null > {
        const user = await usersCollection.findOne({_id: new ObjectId(id)})
            if(!user) {
                return null
            }
            return userMapping(user)
    },
    async findUserConfirmCode(code: string):  Promise< WithId< UserAccountDBModel > | null> {
        const user =  await usersCollection.findOne({"emailConfirmation.confirmationCode": code})
        if(!user) {
            return null
        }
        return user
    },
    async updateConfirmedCode(code: string):  Promise<boolean> {
        const updateResult = await usersCollection.updateOne({"emailConfirmation.confirmationCode": code}, {$set: {"emailConfirmation.isConfirmed": true }})
            return updateResult.matchedCount === 1
    },
    async updateConfirmationCodeByEmail(email: string, code: string):  Promise<boolean> {
        const updateResult = await usersCollection.updateOne({email}, {$set: {"emailConfirmation.confirmationCode": code }})
        return updateResult.matchedCount === 1
    },
    async findUserForComment(userId: string):  Promise<UserViewModel | null > {
        const user = await usersCollection.findOne({_id: new ObjectId(userId)})
            if(!user) { return null }

            return userMapping(user)
    },
    async findByLoginOrEmail(loginOrEmail: string): Promise <WithId<UserAccountDBModel> | null> {
        return  await usersCollection.findOne({$or: [{login: loginOrEmail},{email: loginOrEmail}]})
    },
    async addNewUser(newUser: UserAccountDBModel): Promise <UserViewModel> {
    const result = await usersCollection.insertOne(newUser)
    return {
        id: result.insertedId.toString(),
        login: newUser.login,
        email: newUser.email,
        createdAt: newUser.createdAt
    }
    },
    async userByIdDelete(id: string):Promise <boolean> {
        const deleteResult = await usersCollection.deleteOne({_id: new ObjectId(id)})
        return deleteResult.deletedCount === 1
    },
}