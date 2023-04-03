import { usersCollection } from "../../database/runDB";
import { UserCreateModel, UserViewModel } from "../../models/modelsUsers/usersInputModel";
import { DeleteResult } from "mongodb";
import { blockMongo_Id } from "../../functions/filters";


export const usersRepository = {
    async testingDeleteAllUsers(): Promise<DeleteResult> {
        return await usersCollection.deleteMany({})
    },
    async findUserById(id: string): Promise <UserViewModel | null> {
        return  await usersCollection.findOne({id}, blockMongo_Id)
    },
    async findByLoginOrEmail(loginOrEmail: string): Promise <UserCreateModel | null> {
        return  await usersCollection.findOne({loginOrEmail})
    },
    async addNewUser(newUser: UserCreateModel): Promise <UserViewModel> {
    await usersCollection.insertOne(newUser)
    return {
        id: newUser.id,
        login: newUser.login,
        email: newUser.email,
        createdAt: newUser.createdAt
    }
},
    async userByIdDelete(id: string):Promise <boolean> {
        const deleteResult = await usersCollection.deleteOne({id})
        return deleteResult.deletedCount === 1
    }
}