import jwt from 'jsonwebtoken'
import { settings } from "../settings";
import {
    ObjectId
} from "mongodb";
import { LoginSuccessViewModel, } from "../models/modelsUsersLogin/login-view";

export class JwtService {
    async createJWTAccessToken ( userId: ObjectId ): Promise<LoginSuccessViewModel> {
        const accessToken = jwt.sign({ userId: userId },
            settings.ACCESS_JWT_SECRET,
            { expiresIn: '10h' })
        return {
            accessToken: accessToken
        }
    }


    async createJWTRefreshToken ( userId: ObjectId, deviceId: string ): Promise<string> {

        return jwt.sign({
                userId: userId,
                deviceId
            },
            settings.REFRESH_TOKEN_SECRET,
            { expiresIn: '10h' })
    }


    async getUserIdByAccessToken ( token: string ) {
        try {
            const userId = jwt.verify(token,
                settings.ACCESS_JWT_SECRET) as { userId: string }
            return new ObjectId(userId.userId).toString()
        } catch (error) {
            console.log("error verify", error)
            return null;
        }
    }


    async getUserIdByRefreshToken ( token: string ) {
        try {
            const payload = jwt.verify(token,
                settings.REFRESH_TOKEN_SECRET) as { userId: string }
            return new ObjectId(payload.userId).toString()
        } catch (error) {
            return null
        }
    }


    async getDeviceIdRefreshToken ( token: string ) {
        try {
            const payload = jwt.verify(token,
                settings.REFRESH_TOKEN_SECRET) as { deviceId: string }
            return payload.deviceId
        } catch (error) {
            return null
        }
    }


    async getIATByRefreshToken ( token: string ): Promise<number | undefined | null> {
        try {
            const decoded = jwt.decode(token,
                { complete: true }) as jwt.JwtPayload
            return decoded.payload.iat
        } catch (error) {
            return null
        }
    }
}

