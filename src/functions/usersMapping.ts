import {UserCreateModel, UserViewModel} from "../models/modelsUsers/usersInputModel";
import {WithId} from "mongodb";

export const usersMapping = (array: Array<WithId<UserCreateModel>>): UserViewModel[] =>{
    return array.map((el) => {
        return {
            id: el._id.toString(),
            login: el.login,
            email: el.email,
            createdAt: el.createdAt
        }
    })
}