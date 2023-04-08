import {UserCreateModel, UserViewModel} from "../models/modelsUsers/usersInputModel";
import { usersRepository } from "../repositories/db/users-db-repository";
import bcrypt from 'bcrypt';
import {WithId} from "mongodb";

export const usersService = {
    async createUser(login: string, password: string, email: string  ): Promise<UserViewModel> {
        const salt =  await bcrypt.genSalt( 7 )
        const hash = await this.generateHash(password, salt)
        const newUser: UserCreateModel = {
            login: login,
            passwordHash: hash,
            passwordSalt: salt,
            email: email,
            createdAt: new Date().toISOString()
        }
        return await usersRepository.addNewUser(newUser)
    },
    async findUserById(id: string): Promise <UserViewModel | null> {
        return   await usersRepository.findUserById(id)
    }
    ,
    async checkCredentials(loginOrEmail: string, password: string): Promise <WithId<UserCreateModel> | null> {
        const user =  await usersRepository.findByLoginOrEmail(loginOrEmail)
        if(!user) {
            return null
        }
        const passwordHash = await this.generateHash(password, user.passwordSalt)
        if (user.passwordHash === passwordHash) {
            return user
        } else {
            return null
        }

    },
    async generateHash(password: string, passwordSalt: string) {
       return await bcrypt.hash(password, passwordSalt)
    },
    async userByIdDelete(id: string):Promise <boolean> {
        return await usersRepository.userByIdDelete(id)
    }
}