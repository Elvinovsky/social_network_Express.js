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
            const userId = jwt.verify(token, settings.ACCESS_JWT_SECRET) as jwt.JwtPayload
            return new ObjectId(userId.userId).toString()
        } catch (error) {
            return null;
        }
    },
    async getUserIdByRefreshToken ( token: string ) {
        try {
            const userId = jwt.verify(token, settings.REFRESH_TOKEN_SECRET) as jwt.JwtPayload
            return  new ObjectId(userId.userId).toString()
        } catch (error) {
                return null
        }
    },
    async getIATByRefreshToken ( token: string ):Promise<number | null> {
        try {
            const decoded = jwt.decode(token, {complete: true}) as jwt.JwtPayload
            return  decoded.payload.iat
        } catch (error) {
            return null
        }
    }
}