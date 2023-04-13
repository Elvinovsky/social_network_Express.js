import {UserAccountDBModel} from "../models/modelsUsersLogin/user-input";
import { usersRepository } from "../repositories/db/users-db-repository";
import bcrypt from 'bcrypt';
import {WithId} from "mongodb";
import {UserViewModel} from "../models/modelsUsersLogin/user-view";
import add from 'date-fns/add'
import {v4 as uuidv4} from 'uuid'
import {emailsManager} from "../adapter/emails-manager";

export const usersService = {
    async userByAnAdminRegistration(login: string, password: string, email: string  ): Promise<UserViewModel> {
        const salt =  await bcrypt.genSalt( 7 )
        const hash = await this.generateHash(password, salt)
        const newUser: UserAccountDBModel = {
            login: login,
            passwordHash: hash,
            email: email,
            createdAt: new Date().toISOString(),
            emailConfirmation: {
                confirmationCode: "not required",
                expirationDate: "not required",
                isConfirmed: true
            }
        }
        return await usersRepository.addNewUser(newUser)
    },
    async independentUserRegistration(login: string, password: string, email: string  ): Promise<UserViewModel | null> {
        const salt =  await bcrypt.genSalt( 7 )
        const hash = await this.generateHash(password, salt)

        const newUser: UserAccountDBModel = {
            login: login,
            passwordHash: hash,
            email: email,
            createdAt: new Date().toISOString(),
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {
                    hours: 1,
                   // minutes:10
                }),
                isConfirmed: false
            }
        }
        const result = await usersRepository.addNewUser(newUser)
        try {
            await emailsManager.sendEmailConformationMessage(newUser)
        }catch(error) {
            console.error(error)
            //await usersRepository.deleteUsers
            return null
        }
        return result
    },
    async findUserById(id: string): Promise <UserViewModel | null> {
        return await usersRepository.findUserById(id)
    },
    async confirmCode(code: string): Promise <boolean> {
        return await usersRepository.confirmedCode(code)
    },
    async checkCredentials(loginOrEmail: string, password: string): Promise <WithId<UserAccountDBModel> | null> {
        const user =  await usersRepository.findByLoginOrEmail(loginOrEmail)
        if(!user) {
            return null
        }
        const salt = await bcrypt.genSalt( 7 )
        const passwordHash = await this.generateHash(password, salt)
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