import {usersCollection} from "../../database/runDB";
import {UserViewModel} from "../../models/modelsUsers/usersInputModel";

export const usersRepository = {
async addNewUser(newUser: UserViewModel): Promise <UserViewModel> {
    await usersCollection.insertOne(newUser)
    return {
        login: newUser.login,
        password: newUser.password,
        email: newUser.email,
        createdAt: newUser.createdAt
    }
},
}