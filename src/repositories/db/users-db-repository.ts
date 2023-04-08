import {usersCollection} from "../../database/runDB";
import { UserCreateModel, UserViewModel } from "../../models/modelsUsers/usersInputModel";
import {DeleteResult, ObjectId, WithId} from "mongodb";

function userMapping(user:  WithId<UserCreateModel> ): UserViewModel {
    const mongoId = user._id
    return {
        id: mongoId.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt
    }
}
export const usersRepository = {
    async testingDeleteAllUsers(): Promise<DeleteResult> {
        return await usersCollection.deleteMany({})
    },
    async findUserById(id: string):  Promise<UserViewModel | null> {
        const user = await usersCollection.findOne({_id: new ObjectId(id)})
        if(!user) {
            return null
        }
        return userMapping(user)
    },
    async findByLoginOrEmail(loginOrEmail: string): Promise <WithId<UserCreateModel> | null> {
        return  await usersCollection.findOne({$or: [{login: loginOrEmail},{email: loginOrEmail}]})
    },
    async addNewUser(newUser: UserCreateModel): Promise <UserViewModel> {
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
    }
}