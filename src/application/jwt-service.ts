import jwt from 'jsonwebtoken'
import { settings } from "../settings";
import {
    ObjectId
} from "mongodb";
import { LoginSuccessViewModel, } from "../models/modelsUsersLogin/login-view";
export const jwtService = {
    async createJWTAccessToken ( userId: ObjectId ): Promise<LoginSuccessViewModel> {
        const accessToken = jwt.sign({ userId: userId },
            settings.ACCESS_JWT_SECRET,
            { expiresIn: '10s' })
        return {
            accessToken: accessToken
        }
    },
    async createJWTRefreshToken ( userId: ObjectId ): Promise<string> {
        return  jwt.sign({ userId: userId },
            settings.REFRESH_TOKEN_SECRET,
            { expiresIn: '20s' })
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
    }
}