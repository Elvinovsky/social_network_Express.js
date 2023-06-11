import {
    Request,
    Response
} from "express";
import { usersService } from "../domains/users-service";
import { v4 as uuidv4 } from "uuid";
import { jwtService } from "../application/jwt-service";
import requestIp from "request-ip";
import { devicesSessionsService } from "../domains/devices-service";
import { refreshCookieOptions } from "../helpers/cookie-helpers";
import { devicesSessionsRepository } from "../repositories/db/devices-sessions-repository";
import { RequestInputBody } from "../types/req-res-types";
import {
    NewPasswordRecoveryInputModel,
    PasswordRecoveryInputModel,
    RegistrationConfirmationCodeModel,
    RegistrationEmailResending
} from "../models/modelsRegistration/registration-input";
import { usersQueryRepository } from "../repositories/queryRepository/users-query-repository";

class AuthController {
    async createLogin ( req: Request, res: Response ) {
        const user = await usersService.checkCredentials(req.body.loginOrEmail,
            req.body.password)
        if (!user) return res.sendStatus(401)

        const deviceId = uuidv4()
        const accessToken = await jwtService.createJWTAccessToken(user._id)
        const refreshToken = await jwtService.createJWTRefreshToken(user._id,
            deviceId)

        const ipAddress = requestIp.getClientIp(req)
        const deviceName = req.headers["user-agent"]
        const issuedAt = await jwtService.getIATByRefreshToken(refreshToken)
        await devicesSessionsService.createDeviceSession(user._id,
            deviceId,
            issuedAt!,
            ipAddress,
            deviceName,)

        return res
            .status(200)
            .cookie('refreshToken',
                refreshToken,
                refreshCookieOptions)
            .send(accessToken)
    }

    async createRefToken ( req: Request, res: Response ) {
        const accessToken = await jwtService.createJWTAccessToken(req.userId)
        const newRefreshToken = await jwtService.createJWTRefreshToken(req.userId,
            req.deviceId)

        const newIssuedAt = await jwtService.getIATByRefreshToken(newRefreshToken)
        await devicesSessionsService.updateIATByDeviceSession(newIssuedAt!,
            req.issuedAt)

        return res.status(200)
                  .cookie('refreshToken',
                      newRefreshToken,
                      refreshCookieOptions)
                  .send(accessToken)
    }

    async logout ( req: Request, res: Response ) {
        await devicesSessionsRepository.deleteDeviceSessionByIAT(req.issuedAt)
        return res.clearCookie('refreshToken')
                  .sendStatus(204)
    }

    async registration ( req: Request, res: Response ) {
        const user = await usersService.independentUserRegistration(req.body.login,
            req.body.password,
            req.body.email)
        if (user) {
            res.sendStatus(204)
            return
        }

        res.sendStatus(400)
    }

    async registrationConfirm ( req: RequestInputBody<RegistrationConfirmationCodeModel>, res: Response ) {
        const isConfirmed = await usersService.confirmCode(req.body.code)
        if (isConfirmed) {
            res.sendStatus(204)
            return
        }
        res.sendStatus(400)
    }

    async emailResending ( req: RequestInputBody<RegistrationEmailResending>, res: Response ) {
        const isSentCode = await usersService.emailConfirmation(req.body.email)
        if (isSentCode) {
            res.sendStatus(204)
            return
        }
        res.sendStatus(400)
        return
    }

    async passwordRecovery ( req: RequestInputBody<PasswordRecoveryInputModel>, res: Response ) {
        const isSentCode = await usersService.sendPasswordRecovery(req.body.email)
        if (isSentCode) {
            res.sendStatus(204)
            return
        }
        res.sendStatus(400)
        return
    }

    async newPassword ( req: RequestInputBody<NewPasswordRecoveryInputModel>, res: Response ) {

        const recoveryPassword = await usersService.passwordRecovery(req.body.newPassword,
            req.body.recoveryCode)
        if (recoveryPassword === null) {
            res.sendStatus(403)
            return
        }
        if (recoveryPassword) {
            res.sendStatus(204)
            return
        }
        res.sendStatus(400)
    }

    async getMe ( req: Request, res: Response ) {
        const user = await usersQueryRepository.getUserInfo(req.user!.id)
        if (user) {
            res.send(user)
            return
        }
    }
}

export const authController = new AuthController()
