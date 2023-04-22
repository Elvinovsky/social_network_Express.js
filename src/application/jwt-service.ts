import { UserAccountDBModel } from "../models/modelsUsersLogin/user-input";
import jwt from 'jsonwebtoken'
import { settings } from "../settings";
import {
    ObjectId,
    WithId
} from "mongodb";
import { LoginSuccessViewModel, } from "../models/modelsUsersLogin/login-view";
import { usersRepository } from "../repositories/db/users-db-repository";
import { jwtDbRepository } from "../repositories/db/jwt-db-repository";
import { UsedTokenByUser } from "../models/modelsUsersLogin/login-input";

export const jwtService = {
    async createJWTAccessToken ( user: WithId<UserAccountDBModel> ): Promise<LoginSuccessViewModel> {
        const accessToken = jwt.sign({ userId: user._id },
            settings.ACCESS_JWT_SECRET,
            { expiresIn: '10s' })
        return {
            accessToken: accessToken
        }
    },
    async createJWTRefreshToken ( user: WithId<UserAccountDBModel> ): Promise<string> {
        const refreshToken = jwt.sign({ userId: user._id },
            settings.REFRESH_TOKEN_SECRET,
            { expiresIn: '20s' })

        const usingToken: UsedTokenByUser = {
            userId: user._id.toString(),
            refreshToken: refreshToken,
            isValid: true
        }
        await jwtDbRepository.addTokenRepo(usingToken)
        return refreshToken
    },
    async getUserIdByAccessToken ( token: string ) {
        try {
            const result = jwt.verify(token, settings.ACCESS_JWT_SECRET) as { userId: string }
            return new ObjectId(result.userId).toString()
        } catch (error) {
            return null;
        }
    },
    async getUserIdByRefreshToken ( token: string ) {
        try {
            const checkToken = jwt.verify(token, settings.REFRESH_TOKEN_SECRET) as { userId: string }
            return  new ObjectId(checkToken.userId).toString()
        } catch (error) {
                return null
        }
    },
    async rootingToken (token: string):  Promise<boolean>{
        return await jwtDbRepository.rootedToken(token)
    }
}