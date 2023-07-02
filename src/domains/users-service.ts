import { UserDBType } from "../models/modelsUsersLogin/user-input";
import { usersRepository } from "../repositories/db/users-db-repository";
import bcrypt from 'bcrypt';
import { WithId } from "mongodb";
import { UserViewModel } from "../models/modelsUsersLogin/user-view";
import add from 'date-fns/add'
import { v4 as uuidv4 } from 'uuid'
import { userMapping } from "../functions/usersMapping";
import { emailsManager } from "../compositions-root";
import { EmailsManager } from "../adapter/emails-manager";
import {
    inject,
    injectable
} from "inversify";

@injectable()
export class UsersService  {
    constructor (@inject(EmailsManager) protected emailsManager: EmailsManager) {
    }
    //todo перенести логику регистрации юзера в отдельный модуль.
    async userByAnAdminRegistration ( login: string, password: string, email: string ): Promise<UserViewModel> {
        const hash = await this._generateHash(password)
        const newUser: UserDBType = {
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
    }
    async independentUserRegistration ( login: string, password: string, email: string ): Promise<UserViewModel | null> {
        const hash = await this._generateHash(password)
        const newUser: UserDBType = {
            login: login,
            passwordHash: hash,
            email: email,
            createdAt: new Date().toISOString(),
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(),
                    {
                        hours: 1,
                        minutes: 10
                    }),
                isConfirmed: false
            }
        }
        const result = await usersRepository.addNewUser(newUser)
        try {
            await emailsManager.sendEmailConformationMessage(email, newUser.emailConfirmation.confirmationCode)
        } catch (error) {
            console.error(error)
            await usersRepository.userByIdDelete(result.id)
            return null
        }
        return result
    }
    async passwordRecovery ( password: string, code: string ):Promise <boolean | null> {
        const isConfirmed = await this.confirmCode(code)
        const isOneUser = await usersRepository.getUsersByConfirmationCode(code)
        if (!isConfirmed && isOneUser) {
            return null
        }

        const hash = await this._generateHash(password)
        const isRestored = await usersRepository.updatePasswordHash(hash, code)
        return isRestored
    }
    async findUserById ( id: string ): Promise<UserViewModel | null> {
        const user = await usersRepository.findUserById(id)
        if (!user) {
            return null
        }
        return userMapping(user)

    }
    async confirmCode ( code: string ): Promise<boolean> {
        return await usersRepository.updateConfirmCode(code)
    }
    async emailConfirmation ( email: string ): Promise<boolean> {
        const newCode = uuidv4()
        const codeReplacement = await usersRepository.updateConfirmationCodeByEmail(email,
            newCode)
        if (!codeReplacement) {
            return false
        }

        try {
            await this.emailsManager.sendEmailConformationMessage(email,
                newCode)
        } catch (error) {
            const user = await usersRepository.findByLoginOrEmail(email)
            await usersRepository.userByIdDelete(user!._id.toString()) // емайл не подтвержден! user валидириуется в верхних слоях экспресс валидатора
            console.error(error)
            return false
        }
        return true
    }
    async sendPasswordRecovery ( email: string ): Promise<boolean> {
        const newCode = uuidv4()
        const codeReplacement = await usersRepository.updateConfirmationCodeByEmail(email,
            newCode)

        if (!codeReplacement) {
            return false
        }

        try {
            await this.emailsManager.sendEmailPasswordRecovery(email,
                newCode)
        } catch (error) {
            const user = await usersRepository.findByLoginOrEmail(email)
            await usersRepository.userByIdDelete(user!._id.toString()) // емайл подтвержден! user валидириуется при запросе на эндпоинт экспресс валидаторомю
            console.error(error)
            return false
        }

        return true
    }
    async checkCredentials ( loginOrEmail: string, password: string ): Promise<WithId<UserDBType> | null> {
        const user = await usersRepository.findByLoginOrEmail(loginOrEmail)
        if (!user || !user.emailConfirmation.isConfirmed) {
            return null
        }

        const isHashesEquals = await this._isPasswordCorrect(password,
            user.passwordHash)
        if (isHashesEquals) {
            return user
        } else{
            return null
        }
    }
    async _generateHash ( password: string ): Promise<string> {
        return await bcrypt.hash(password,
            7)
    }
    async _isPasswordCorrect ( password: string, hash: string ): Promise<boolean> {
        return await bcrypt.compare(password,
            hash)
    }
    async userByIdDelete ( id: string ): Promise<boolean> {
        return await usersRepository.userByIdDelete(id)
    }
}