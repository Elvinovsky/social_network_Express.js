import {usersCollection} from "../../database/runDB";
import {UserCreateModel, UserViewModel} from "../../models/modelsUsers/usersInputModel";

export const usersRepository = {
async addNewUser(newUser: UserCreateModel): Promise <UserViewModel> {
    await usersCollection.insertOne(newUser)
    return {
        id: newUser.id,
        login: newUser.login,
        email: newUser.email,
        createdAt: newUser.createdAt
    }
},
}