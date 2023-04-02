import {UserCreateModel, UserViewModel} from "../models/modelsUsers/usersInputModel";

export const usersMapping = (array: Array<UserCreateModel>): UserViewModel[] =>{
    return array.map((el) => {
        return {
            id: el.id,
            login: el.login,
            email: el.email,
            createdAt: el.createdAt
        }
    })
}