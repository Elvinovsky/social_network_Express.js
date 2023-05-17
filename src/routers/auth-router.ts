import {
    Response,
    Request,
    Router,
} from "express";
import { RequestInputBody } from "../types/req-res-types";
import { usersService } from "../domains/users-service";
import {
    checksConfirmationCode,
    checksEmailForPasswordRecovery,
    checksEmailResending,
    checksNewPassword,
    checksRecoveryCode,
    validatorBodyUserRegistration,
    validatorInputAuthRout
} from "../middlewares/body-validator/check-bodyUser";
import { jwtService } from "../application/jwt-service";
import {
    refreshTokenAuthentication,
    userAuthentication
} from "../middlewares/guard-authentication/user-authentication";
import { usersQueryRepository } from "../repositories/queryRepository/users-query-repository";
import {
    NewPasswordRecoveryInputModel,
    PasswordRecoveryInputModel,
    RegistrationConfirmationCodeModel,
    RegistrationEmailResending
} from "../models/modelsRegistration/registration-input";
import { UserInputModel } from "../models/modelsUsersLogin/user-input";
import { checkForErrors } from "../middlewares/check-for-errors";
import { refreshCookieOptions } from "../helpers/cookie-helpers";
import requestIp from 'request-ip'
import { devicesSessionsService } from "../domains/devices-service";
import { devicesSessionsRepository } from "../repositories/db/devices-sessions-repository";
import { v4 as uuidv4 } from 'uuid'
import { ipLimiter } from "../middlewares/rateLimiter";

export const authRouter = Router()

authRouter.post('/login',
    ipLimiter,
    validatorInputAuthRout,
    async( req: Request, res: Response ) => {
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
    })
authRouter.post('/refresh-token',
    refreshTokenAuthentication,
    async( req: Request, res: Response ) => {
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
    })
authRouter.post('/logout',
    refreshTokenAuthentication,
    async( req: Request, res: Response ) => {
        await devicesSessionsRepository.deleteDeviceSessionByIAT(req.issuedAt)
        return res.clearCookie('refreshToken')
                  .sendStatus(204)
    })
authRouter.post('/registration',
    ipLimiter,
    validatorBodyUserRegistration,
    async( req: RequestInputBody<UserInputModel>, res: Response ) => {
        const user = await usersService.independentUserRegistration(req.body.login,
            req.body.password,
            req.body.email)
        if (user) {
            res.sendStatus(204)
            return
        }

        res.sendStatus(400)
    })
authRouter.post('/registration-confirmation',
    ipLimiter,
    checksConfirmationCode,
    checkForErrors,
    async( req: RequestInputBody<RegistrationConfirmationCodeModel>, res: Response ) => {
        const isConfirmed = await usersService.confirmCode(req.body.code)
        if (isConfirmed) {
            res.sendStatus(204)
            return
        }
        res.sendStatus(400)
    })
authRouter.post('/registration-email-resending',
    ipLimiter,
    checksEmailResending,
    checkForErrors,
    async( req: RequestInputBody<RegistrationEmailResending>, res: Response ) => {
        const isSentCode = await usersService.emailConfirmation(req.body.email)
        if (isSentCode) {
            res.sendStatus(204)
            return
        }
        res.sendStatus(400)
        return
    })
authRouter.post('/password-recovery',
    ipLimiter,
    checksEmailForPasswordRecovery,
    checkForErrors,
    async( req: RequestInputBody<PasswordRecoveryInputModel>, res: Response ) => {
        const isSentCode = await usersService.sendPasswordRecovery(req.body.email)
        if (isSentCode) {
            res.sendStatus(204)
            return
        }
        res.sendStatus(400)
        return
    })
authRouter.post('/new-password',
    ipLimiter,
    checksNewPassword,
    checksRecoveryCode,
    checkForErrors,
    async( req: RequestInputBody<NewPasswordRecoveryInputModel>, res: Response ) => {

        const recoveryPassword = await usersService.passwordRecovery(req.body.newPassword,
            req.body.recoveryCode)
        if (recoveryPassword === null) {
            res.sendStatus(403)
            return
        }
        if(recoveryPassword) {
            res.sendStatus(204)
            return
        }
        res.sendStatus(400)


    })
authRouter.get('/me',
    userAuthentication,
    async( req: Request, res: Response ) => {
        const user = await usersQueryRepository.getUserInfo(req.user!.id)
        if (user) {
            res.send(user)
            return
        }
    })
