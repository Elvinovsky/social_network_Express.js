import {
    Request,
    Response
} from "express";
import {
    UsersService
} from "../domains/users-service";
import { v4 as uuidv4 } from "uuid";
import requestIp from "request-ip";
import { refreshCookieOptions } from "../helpers/cookie-helpers";
import {
    DevicesSessionsRepository
} from "../repositories/db/devices-sessions-repository";
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


export class AuthController {
    constructor ( protected jwtService: JwtService,
                  protected devicesService: DevicesService,
                  protected devicesSessionsRepository: DevicesSessionsRepository,
                  protected usersService: UsersService) { }

    async createLogin ( req: Request, res: Response ) {
        const user = await this.usersService.checkCredentials(req.body.loginOrEmail,
            req.body.password)
        if (!user) return res.sendStatus(401)

        const deviceId = uuidv4()
        const accessToken = await this.jwtService.createJWTAccessToken(user._id)
        const refreshToken = await this.jwtService.createJWTRefreshToken(user._id,
            deviceId)

        const ipAddress = requestIp.getClientIp(req)
        const deviceName = req.headers["user-agent"]
        const issuedAt = await this.jwtService.getIATByRefreshToken(refreshToken)
        await this.devicesService.createDeviceSession(user._id,
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
        const accessToken = await this.jwtService.createJWTAccessToken(req.userId)
        const newRefreshToken = await this.jwtService.createJWTRefreshToken(req.userId,
            req.deviceId)

        const newIssuedAt = await this.jwtService.getIATByRefreshToken(newRefreshToken)
        await this.devicesService.updateIATByDeviceSession(newIssuedAt!,
            req.issuedAt)

        return res.status(200)
                  .cookie('refreshToken',
                      newRefreshToken,
                      refreshCookieOptions)
                  .send(accessToken)
    }

    async logout ( req: Request, res: Response ) {
        await this.devicesSessionsRepository.deleteDeviceSessionByIAT(req.issuedAt)
        return res.clearCookie('refreshToken')
                  .sendStatus(204)
    }

    async registration ( req: Request, res: Response ) {
        const user = await this.usersService.independentUserRegistration(req.body.login,
            req.body.password,
            req.body.email)
        if (user) {
            res.sendStatus(204)
            return
        }

        res.sendStatus(400)
    }

    async registrationConfirm ( req: RequestInputBody<RegistrationConfirmationCodeModel>, res: Response ) {
        const isConfirmed = await this.usersService.confirmCode(req.body.code)
        if (isConfirmed) {
            res.sendStatus(204)
            return
        }
        res.sendStatus(400)
    }

    async emailResending ( req: RequestInputBody<RegistrationEmailResending>, res: Response ) {
        const isSentCode = await this.usersService.emailConfirmation(req.body.email)
        if (isSentCode) {
            res.sendStatus(204)
            return
        }
        res.sendStatus(400)
        return
    }

    async passwordRecovery ( req: RequestInputBody<PasswordRecoveryInputModel>, res: Response ) {
        const isSentCode = await this.usersService.sendPasswordRecovery(req.body.email)
        if (isSentCode) {
            res.sendStatus(204)
            return
        }
        res.sendStatus(400)
        return
    }

    async newPassword ( req: RequestInputBody<NewPasswordRecoveryInputModel>, res: Response ) {

        const recoveryPassword = await this.usersService.passwordRecovery(req.body.newPassword,
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

