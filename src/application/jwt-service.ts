import { UserAccountDBModel } from "../models/modelsUsersLogin/user-input";
import jwt from 'jsonwebtoken'
import { settings } from "../settings";
import {
    ObjectId,
    WithId
} from "mongodb";
import { LoginSuccessViewModel } from "../models/modelsUsersLogin/login-view";
import { usersRepository } from "../repositories/db/users-db-repository";

export const jwtService = {
    async createJWTAccessToken ( user: WithId<UserAccountDBModel> ): Promise<LoginSuccessViewModel> {
        const accessToken = jwt.sign({ userId: new ObjectId(user._id) },
            settings.ACCESS_JWT_SECRET,
            { expiresIn: '10m' })
        return {
            accessToken: accessToken
        }
    },
    async createJWTRefreshToken ( user: WithId<UserAccountDBModel> ) {
        return jwt.sign({ userId: new ObjectId(user._id) },
            settings.REFRESH_TOKEN_SECRET,
            { expiresIn: '20m' })
    },
    async getUserIdByAccessToken ( token: string ) {
        try {
            const result = jwt.verify(token,
                settings.ACCESS_JWT_SECRET) as { userId: string }
            return new ObjectId(result.userId).toString()
        } catch (error) {
            return null;
        }
    },
    async getUserIdByRefreshToken ( token: string ) {
        try {
            const checkToken = jwt.verify(token,
                settings.REFRESH_TOKEN_SECRET) as { userId: string }
            const userId = new ObjectId(checkToken.userId).toString()
            const user = await usersRepository.findUserById(userId)
            return user
        } catch (error) {
            return null;
        }
    }
}