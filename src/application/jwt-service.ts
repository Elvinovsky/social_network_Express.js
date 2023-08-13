import jwt from 'jsonwebtoken'
import { settings } from "../settings";
import {
    ObjectId
} from "mongodb";
import { LoginSuccessViewModel, } from "../models/modelsUsersLogin/login-view";
import { injectable } from "inversify";

@injectable()
export class JwtService {
    /**
     * Создает JWT access token с указанным userId.
     * @param userId Идентификатор пользователя (ObjectId).
     * @returns Объект с access token.
     */
    async createJWTAccessToken ( userId: ObjectId ): Promise<LoginSuccessViewModel> {
        const accessToken = jwt.sign({ userId: userId },
            settings.ACCESS_JWT_SECRET,
            { expiresIn: '10h' })
        return {
            accessToken: accessToken
        }
    }

    /**
     * Создает JWT refresh token с указанными userId и deviceId.
     * @param userId Идентификатор пользователя (ObjectId).
     * @param deviceId Уникальный идентификатор устройства.
     * @returns Строка с refresh token.
     */
    async createJWTRefreshToken ( userId: ObjectId, deviceId: string ): Promise<string> {
        return jwt.sign({
                userId: userId,
                deviceId
            },
            settings.REFRESH_TOKEN_SECRET,
            { expiresIn: '10h' })
    }

    /**
     * Получает идентификатор пользователя из access token.
     * @param token Access token.
     * @returns Идентификатор пользователя (ObjectId) или null в случае ошибки.
     */
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

    /**
     * Получает идентификатор пользователя из refresh token.
     * @param token Refresh token.
     * @returns Идентификатор пользователя (ObjectId) или null в случае ошибки.
     */
    async getUserIdByRefreshToken ( token: string ) {
        try {
            const payload = jwt.verify(token,
                settings.REFRESH_TOKEN_SECRET) as { userId: string }
            return new ObjectId(payload.userId).toString()
        } catch (error) {
            return null
        }
    }

    /**
     * Получает идентификатор устройства из refresh token.
     * @param token Refresh token.
     * @returns Идентификатор устройства или null в случае ошибки.
     */
    async getDeviceIdRefreshToken ( token: string ) {
        try {
            const payload = jwt.verify(token,
                settings.REFRESH_TOKEN_SECRET) as { deviceId: string }
            return payload.deviceId
        } catch (error) {
            return null
        }
    }

    /**
     * Получает время создания (IAT) из refresh token.
     * @param token Refresh token.
     * @returns Время создания или null в случае ошибки.
     */
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