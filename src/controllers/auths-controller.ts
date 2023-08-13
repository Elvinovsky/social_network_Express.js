import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import requestIp from "request-ip";
import { refreshCookieOptions } from "../helpers/cookie-helpers";
import { DevicesSessionsRepository } from "../repositories/db/devices-sessions-repository";
import { RequestInputBody } from "../types/req-res-types";
import {
    NewPasswordRecoveryInputModel,
    PasswordRecoveryInputModel,
    RegistrationConfirmationCodeModel,
    RegistrationEmailResending
} from "../models/modelsRegistration/registration-input";
import { usersQueryRepository } from "../repositories/queryRepository/users-query-repository";
import { DevicesService } from "../domains/devices-service";
import { JwtService } from "../application/jwt-service";
import { inject, injectable } from "inversify";
import { AuthService } from "../domains/auth-service";

@injectable()
export class AuthController {
    constructor(
        @inject(JwtService) protected jwtService: JwtService,
        @inject(DevicesService) protected devicesService: DevicesService,
        @inject(DevicesSessionsRepository) protected devicesSessionsRepository: DevicesSessionsRepository,
        @inject(AuthService) protected authService: AuthService
    ) {}

    /**
     * Обработчик для создания авторизационного токена при входе пользователя.
     */
    async createLogin(req: Request, res: Response) {
        // Поиск пользователя и проверка учетных данных.
        const user = await this.authService.checkCredentials(
            req.body.loginOrEmail,
            req.body.password
        );
        if (!user) {
            return res.sendStatus(401); // Ошибка: Не авторизован.
        }

        // Создание уникального идентификатора устройства и токенов.
        const deviceId = uuidv4();
        const accessToken = await this.jwtService.createJWTAccessToken(user._id);
        const refreshToken = await this.jwtService.createJWTRefreshToken(
            user._id,
            deviceId
        );

        // Получение IP-адреса и имени устройства.
        const ipAddress = requestIp.getClientIp(req);
        const deviceName = req.headers["user-agent"];
        const issuedAt = await this.jwtService.getIATByRefreshToken(refreshToken);

        // Создание записи о сессии устройства.
        await this.devicesService.createDeviceSession(
            user._id,
            deviceId,
            issuedAt!,
            ipAddress,
            deviceName
        );

        // Отправка токена в ответе и установка refreshToken в куках.
        return res
            .status(200)
            .cookie("refreshToken", refreshToken, refreshCookieOptions)
            .send(accessToken);
    }

    /**
     * Обработчик для создания нового refreshToken на основе старого.
     */
    async createRefToken(req: Request, res: Response) {
        // Создание нового access token и refreshToken.
        const accessToken = await this.jwtService.createJWTAccessToken(req.userId);
        const newRefreshToken = await this.jwtService.createJWTRefreshToken(
            req.userId,
            req.deviceId
        );

        // Получение нового времени создания токена.
        const newIssuedAt = await this.jwtService.getIATByRefreshToken(
            newRefreshToken
        );

        // Обновление времени создания в сессии устройства.
        await this.devicesService.updateIATByDeviceSession(
            newIssuedAt!,
            req.issuedAt
        );

        // Отправка нового refreshToken в куках и access token в ответе.
        return res
            .status(200)
            .cookie("refreshToken", newRefreshToken, refreshCookieOptions)
            .send(accessToken);
    }

    /**
     * Обработчик для выхода пользователя (удаление сессии устройства).
     */
    async logout(req: Request, res: Response) {
        // Удаление записи о сессии устройства.
        await this.devicesSessionsRepository.deleteDeviceSessionByIAT(
            req.issuedAt
        );

        // Удаление refreshToken из куков и отправка успешного статуса.
        return res.clearCookie("refreshToken").sendStatus(204);
    }

    /**
     * Обработчик для регистрации пользователя.
     */
    async registration(req: Request, res: Response) {
        // Попытка регистрации пользователя.
        const user = await this.authService.userRegistration(
            req.body.login,
            req.body.password,
            req.body.email
        );
        if (user) {
            res.sendStatus(204); // Успешный статус: OK, без содержимого.
            return;
        }

        res.sendStatus(400); // Ошибка: Плохой запрос.
    }

    /**
     * Обработчик для подтверждения кода регистрации.
     */
    async registrationConfirm(
        req: RequestInputBody<RegistrationConfirmationCodeModel>,
        res: Response
    ) {
        // Проверка кода подтверждения и отправка соответствующего статуса.
        const isConfirmed = await this.authService.confirmCode(req.body.code);
        if (isConfirmed) {
            res.sendStatus(204); // Успешный статус: OK, без содержимого.
            return;
        }
        res.sendStatus(400); // Ошибка: Плохой запрос.
    }

    /**
     * Обработчик для повторной отправки регистрационного email.
     */
    async emailResending(
        req: RequestInputBody<RegistrationEmailResending>,
        res: Response
    ) {
        // Повторная отправка кода подтверждения email.
        const isSentCode = await this.authService.emailResending(req.body.email);
        if (isSentCode) {
            res.sendStatus(204); // Успешный статус: OK, без содержимого.
            return;
        }
        res.sendStatus(400); // Ошибка: Плохой запрос.
    }

    /**
     * Обработчик для отправки кода восстановления пароля.
     */
    async passwordRecovery(
        req: RequestInputBody<PasswordRecoveryInputModel>,
        res: Response
    ) {
        // Отправка кода восстановления пароля.
        const isSentCode = await this.authService.sendPasswordRecovery(
            req.body.email
        );
        if (isSentCode) {
            res.sendStatus(204); // Успешный статус: OK, без содержимого.
            return;
        }
        res.sendStatus(400); // Ошибка: Плохой запрос.
    }

    /**
     * Обработчик для установки нового пароля после восстановления.
     */
    async newPassword(
        req: RequestInputBody<NewPasswordRecoveryInputModel>,
        res: Response
    ) {
        // Установка нового пароля после восстановления.
        const recoveryPassword = await this.authService.passwordRecovery(
            req.body.newPassword,
            req.body.recoveryCode
        );
        if (recoveryPassword === null) {
            res.sendStatus(403); // Ошибка: Запрещено (отказано в доступе).
            return;
        }
        if (recoveryPassword) {
            res.sendStatus(204); // Успешный статус: OK, без содержимого.
            return;
        }
        res.sendStatus(400); // Ошибка: Плохой запрос.
    }

    /**
     * Обработчик для получения информации о текущем пользователе.
     */
    async getMe(req: Request, res: Response) {
        // Получение информации о текущем пользователе.
        const user = await usersQueryRepository.getUserInfo(req.user!.id);
        if (user) {
            res.send(user); // Отправка информации о пользователе.
            return;
        }
        res.sendStatus(404); // Ошибка: Не найдено (информация о пользователе отсутствует).
    }
}