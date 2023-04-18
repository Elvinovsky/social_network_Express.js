import {UserAccountDBModel} from "../models/modelsUsersLogin/user-input";
import { usersRepository } from "../repositories/db/users-db-repository";
import bcrypt from 'bcrypt';
import {WithId} from "mongodb";
import {UserViewModel} from "../models/modelsUsersLogin/user-view";
import add from 'date-fns/add'
import {v4 as uuidv4} from 'uuid'
import {emailsManager} from "../adapter/emails-manager";
import {userMapping} from "../functions/usersMapping";

export const usersService = {
    async userByAnAdminRegistration(login: string, password: string, email: string, ip: string ): Promise<UserViewModel> {
        const hash = await this._generateHash(password)
        const newUser: UserAccountDBModel = {
            login: login,
            passwordHash: hash,
            email: email,
            createdAt: new Date().toISOString(),
            emailConfirmation: {
                confirmationCode: "not required",
                expirationDate: "not required",
                isConfirmed: true
            },
            geolocationData: {
                ip: ip
            }
        }
        return await usersRepository.addNewUser(newUser)
    },
    async independentUserRegistration(login: string, password: string, email: string, ip: string ): Promise<UserViewModel | null> {
        const hash = await this._generateHash(password)
        const newUser: UserAccountDBModel = {
            login: login,
            passwordHash: hash,
            email: email,
            createdAt: new Date().toISOString(),
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes:10
                }),
                isConfirmed: false
            },
            geolocationData: {
                ip: ip
            }
        }
        const result = await usersRepository.addNewUser(newUser)
        try {
            await emailsManager.sendEmailConformationMessage(newUser)
        }catch(error) {
            console.error(error)
            await usersRepository.userByIdDelete(result.id)
            return null
        }
        return result
    },
    async findUserById(id: string): Promise <UserViewModel | null> {
        const user = await usersRepository.findUserById(id)
        if(!user) {
            return null
        }
        return userMapping(user)

    },
    async confirmCode(code: string, ip: string): Promise <boolean> {
        const isComparisonIP = await usersRepository.findUserConfirmCode(code)
            if (isComparisonIP!.geolocationData.ip !== ip) return false // todo доработать. убрать в отдельный модуль?
        return  await usersRepository.updateConfirmedCode(code)
    },
    async emailConfirmation(email: string  ): Promise<boolean> {
        const newCode = uuidv4()
        const codeReplacement = await usersRepository.updateConfirmationCodeByEmail(email, newCode)
            if(!codeReplacement) return false

        const user = await usersRepository.findByLoginOrEmail(email)
            if(!user || user.emailConfirmation.isConfirmed) return false // todo слой мидлваре?

        try {
            await emailsManager.sendEmailConformationMessage(user)
        }catch(error) {
            await usersRepository.userByIdDelete(user._id.toString())
            console.error(error)
            return false
        }
        return true
    },
    async checkCredentials(loginOrEmail: string, password: string): Promise <WithId<UserAccountDBModel> | null> {
        const user =  await usersRepository.findByLoginOrEmail(loginOrEmail)
            if(!user
            || !user.emailConfirmation.isConfirmed) {
                return null
            }

        const isHashesEquals = await this._isPasswordCorrect(password, user.passwordHash)
            if (isHashesEquals) {
                return user
            } else {
               return null
            }
    },
    async _generateHash(password: string): Promise<string> {
       return await bcrypt.hash(password, 7)
    },
    async _isPasswordCorrect(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash)
    },
    async userByIdDelete(id: string):Promise <boolean> {
        return await usersRepository.userByIdDelete(id)
    }
}