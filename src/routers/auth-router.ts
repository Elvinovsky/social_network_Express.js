import { Response, Request, Router } from "express";
import { RequestInputBody } from "../types/req-res-types";
import { usersService } from "../domains/users-service";
import { LoginInput } from "../models/modelsUsersLogin/login-input";
import {
    checksConfirmationCode, checksEmailResending, validatorBodyUserRegistration, validatorInputAuthRout
} from "../middlewares/body-validator/check-bodyUser";
import { jwtService } from "../application/jwt-service";
import { userAuthentication } from "../middlewares/guard-authentication/user-authentication";
import { usersQueryRepository } from "../repositories/queryRepository/users-query-repository";
import {
    RegistrationConfirmationCodeModel, RegistrationDetectedModel, RegistrationEmailResending
} from "../models/modelsRegistration/registration-input";
import { UserInputModel } from "../models/modelsUsersLogin/user-input";
import { checkForErrors } from "../middlewares/check-for-errors";
import ip from "ip";

export const authRouter = Router()

authRouter.post('/login',
    validatorInputAuthRout,
    async( req: RequestInputBody<LoginInput>, res: Response ) => {
        const user = await usersService.checkCredentials(req.body.loginOrEmail,
            req.body.password)
        if (user) {
            const accessToken = await jwtService.createJWTAccessToken(user)
            const refreshToken = await jwtService.createJWTRefreshToken(user)
            res.cookie('jwt',
                refreshToken,
                {
                    httpOnly: true, sameSite: 'none', secure: true, maxAge: 24 * 60 * 60 * 1000
                })
            return res.status(200)
                      .send(accessToken)
        } else{
            res.sendStatus(401)
            return;
        }
    })
authRouter.post('/refresh-token',
    async( req: Request, res: Response ) => {
        const checkRefreshToken = await jwtService.getUserIdByRefreshToken(req.cookies.jwt)
        if (checkRefreshToken) {
            const accessToken = await jwtService.createJWTAccessToken(checkRefreshToken)
            const refreshToken = await jwtService.createJWTRefreshToken(checkRefreshToken)
            res.cookie('jwt',
                refreshToken,
                {
                    httpOnly: true, sameSite: 'none', secure: true, maxAge: 24 * 60 * 60 * 1000
                })
            return res.status(200)
                      .send(accessToken)
        } else{
            res.sendStatus(401)
            return;
        }
    })
authRouter.post('/registration',
    validatorBodyUserRegistration,
    async( req: RequestInputBody<UserInputModel>, res: Response ) => {
        const ipAddresses = ip.address()// todo убрать в отдельный модуль реализовать четкую логику.
        const user = await usersService.independentUserRegistration(req.body.login,
            req.body.password,
            req.body.email,
            ipAddresses)
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
        const ipAddresses = ip.address()// todo убрать в отдельный модуль реализовать четкую логику.
        const user = await usersService.confirmCode(req.body.code,
            ipAddresses)
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
    async( req: RequestInputBody<LoginInput>, res: Response ) => {
        const user = await usersQueryRepository.getUserInfo(req.user!.id)
        if (user) {
            res.send(user)
            return
        }
    })
