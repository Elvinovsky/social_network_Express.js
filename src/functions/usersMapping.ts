import {UserViewModel} from "../models/modelsUsers/usersInputModel";

export const usersMapping = (array: Array<UserViewModel>) =>{
    return array.map((el: UserViewModel) => {
        return {
            id: el.id,
            login: el.login,
            password: el.password,
            email: el.email,
            createdAt: el.createdAt
        }
    })
}