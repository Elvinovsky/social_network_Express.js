import {UserDBModel} from "../models/modelsUsersLogin/user-input";
import {WithId} from "mongodb";
import {UserViewModel} from "../models/modelsUsersLogin/user-view";

export const usersMapping = (array: Array<WithId<UserDBModel>>): UserViewModel[] =>{
    return array.map((el) => {
        return {
            id: el._id.toString(),
            login: el.login,
            email: el.email,
            createdAt: el.createdAt
        }
    })
}
export const userMapping = (user:  WithId<UserDBModel> ): UserViewModel => {
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt
    }
}