import {UserCreateModel, UserViewModel} from "../models/modelsUsers/usersInputModel";
import { usersRepository } from "../repositories/db/users-db-repository";
import bcrypt from 'bcrypt';

export const usersService = {
    async createUser(login: string, password: string, email: string  ): Promise<UserViewModel> {
        const passwordSalt =  await bcrypt.genSalt( 7 )
        const passwordHash = await this.generateHash(password, passwordSalt)
        const newUser: UserCreateModel = {
            id: (+(new Date())).toString(),
            login: login,
            password: passwordHash,
            salt: passwordSalt,
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
    async generateHash(password: string, passwordSalt: string) {
       return await bcrypt.hash(password, passwordSalt)
    },
    async userByIdDelete(id: string):Promise <boolean> {
        return await usersRepository.userByIdDelete(id)
    }
}