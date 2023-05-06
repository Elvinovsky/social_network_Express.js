import {
    Response,
    Request,
    Router,
} from "express";
import { RequestInputBody } from "../types/req-res-types";
import { usersService } from "../domains/users-service";
import {
    checksConfirmationCode, checksEmailResending, validatorBodyUserRegistration, validatorInputAuthRout
} from "../middlewares/body-validator/check-bodyUser";
import { jwtService } from "../application/jwt-service";
import {
    refreshTokenAuthentication,
    userAuthentication
} from "../middlewares/guard-authentication/user-authentication";
import { usersQueryRepository } from "../repositories/queryRepository/users-query-repository";
import {
    RegistrationConfirmationCodeModel, RegistrationDetectedModel, RegistrationEmailResending
} from "../models/modelsRegistration/registration-input";
import { UserInputModel } from "../models/modelsUsersLogin/user-input";
import { checkForErrors } from "../middlewares/check-for-errors";
import { refreshCookieOptions } from "../helpers/cookie-helpers";
import requestIp from 'request-ip'
import { devicesSessionsService } from "../domains/devices-service";
import { devicesSessionsRepository } from "../repositories/db/devices-sessions-repository";

export const authRouter = Router()

authRouter.post('/login',
    validatorInputAuthRout,
    async( req: Request, res: Response ) => {
        const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
        if (!user) return res.sendStatus(401)

        const  deviceId = new Date().toISOString()
        const accessToken = await jwtService.createJWTAccessToken(user._id)
        const refreshToken = await jwtService.createJWTRefreshToken(user._id, deviceId)

        const ipAddress = requestIp.getClientIp(req)
        const deviceName = req.headers["user-agent"]
        const issuedAt = await jwtService.getIATByRefreshToken(refreshToken)
        await devicesSessionsService.createDeviceSession( user._id, issuedAt!, ipAddress, deviceName, )

        return res
                .status(200)
                .cookie('refreshToken', refreshToken, refreshCookieOptions)
                .send(accessToken)
    })
authRouter.post('/refresh-token',refreshTokenAuthentication,
    async( req: Request, res: Response ) => {
        const  deviceId = new Date().toISOString()
        const accessToken = await jwtService.createJWTAccessToken(req.userId)
        const newRefreshToken = await jwtService.createJWTRefreshToken(req.userId, deviceId)

        const newIssuedAt = await jwtService.getIATByRefreshToken(newRefreshToken)
        await devicesSessionsService.updateIATByDeviceSession(newIssuedAt!,req.issuedAt)

        return res.status(200)
                          .cookie('refreshToken', newRefreshToken, refreshCookieOptions)
                          .send(accessToken)
    })
authRouter.post('/logout', refreshTokenAuthentication,
    async( req: Request, res: Response ) => {
        await devicesSessionsRepository.deleteDeviceSessionByIAT(req.issuedAt)
        return res.clearCookie('refreshToken').sendStatus(204)
    })
authRouter.post('/registration',
    validatorBodyUserRegistration,
    async( req: RequestInputBody<UserInputModel>, res: Response ) => {
        const user = await usersService.independentUserRegistration(
            req.body.login,
            req.body.password,
            req.body.email)
        if (user) {
            res.sendStatus(204)
            return
        }
        res.sendStatus(400)
    })
authRouter.post('/registration-confirmation',
    checksConfirmationCode,
    checkForErrors,
    async( req: RequestInputBody<RegistrationConfirmationCodeModel & RegistrationDetectedModel>, res: Response ) => {
        const user = await usersService.confirmCode(req.body.code)
        if (user) {
            res.sendStatus(204)
            return
        }
        res.sendStatus(400)
    })
authRouter.post('/registration-email-resending',
    checksEmailResending,
    checkForErrors,
    async( req: RequestInputBody<RegistrationEmailResending>, res: Response ) => {
        const user = await usersService.emailConfirmation(req.body.email)
        if (user) {
            res.sendStatus(204)
            return
        }
        res.sendStatus(400)
        return
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
