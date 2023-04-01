import { UserViewModel } from "../models/modelsUsers/usersInputModel";
import { usersRepository } from "../repositories/db/users-db-repository";

export const usersService = {
    async createUser(login: string, password: string, email: string  ): Promise<UserViewModel> {
        const newUser: UserViewModel = {
            id: (+(new Date())).toString(),
            login: login,
            password: password,
            email: email,
            createdAt: new Date().toISOString()
        }
        return await usersRepository.addNewUser(newUser)
    },
}