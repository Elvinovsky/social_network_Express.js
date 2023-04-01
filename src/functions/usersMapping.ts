import {UserCreateModel, UserViewModel} from "../models/modelsUsers/usersInputModel";

export const usersMapping = (array: Array<UserCreateModel>) =>{
    return array.map((el: UserViewModel) => {
        return {
            id: el.id,
            login: el.login,
            email: el.email,
            createdAt: el.createdAt
        }
    })
}