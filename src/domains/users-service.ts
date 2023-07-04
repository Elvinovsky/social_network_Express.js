import { UserDBType } from "../models/modelsUsersLogin/user-input";
import { usersRepository } from "../repositories/db/users-db-repository";
import { UserViewModel } from "../models/modelsUsersLogin/user-view";
import { userMapping } from "../functions/usersMapping";
import { inject, injectable } from "inversify";
import { AuthService } from "./auth-service";

@injectable()
export class UsersService  {
    constructor (@inject(AuthService) protected authService: AuthService) {
    }
    async userByAdminRegistration ( login: string, password: string, email: string ): Promise<UserViewModel> {
        const hash = await this.authService._generateHash(password)
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
    async findUserById ( id: string ): Promise<UserViewModel | null> {
        const user = await usersRepository.findUserById(id)
        if (!user) {
            return null
        }
        return userMapping(user)

    }
    async userByIdDelete ( id: string ): Promise<boolean> {
        return await usersRepository.userByIdDelete(id)
    }
}