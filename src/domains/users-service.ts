import {UserCreateModel, UserViewModel} from "../models/modelsUsers/usersInputModel";
import { usersRepository } from "../repositories/db/users-db-repository";
import bcrypt from 'bcrypt';

export const usersService = {
    async createUser(login: string, password: string, email: string  ): Promise<UserViewModel> {
        const salt =  await bcrypt.genSalt( 7 )
        const hash = await this.generateHash(password, salt)
        const newUser: UserCreateModel = {
            id: (+(new Date())).toString(),
            login: login,
            passwordHash: hash,
            passwordSalt: salt,
            email: email,
            createdAt: new Date().toISOString()
        }
        return await usersRepository.addNewUser(newUser)
    },
    async findUserById(id: string): Promise <UserViewModel | null> {
        const user =  await usersRepository.findUserById(id)
        if(!user) return null
        return {
            id: user.id,
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
            }
    },
    async checkCredentials(loginOrEmail: string, password: string): Promise <boolean> {
        const user =  await usersRepository.findByLoginOrEmail(loginOrEmail)
        if(!user) {
            return false
        }
        const passwordHash = await this.generateHash(password, user.passwordSalt)
        return user.passwordHash === passwordHash;

    },
    async generateHash(password: string, passwordSalt: string) {
       return await bcrypt.hash(password, passwordSalt)
    },
    async userByIdDelete(id: string):Promise <boolean> {
        return await usersRepository.userByIdDelete(id)
    }
}