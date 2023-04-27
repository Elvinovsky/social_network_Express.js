import {
    Response,
    Request,
    Router,
} from "express";
import { RequestInputBody } from "../types/req-res-types";
import { usersService } from "../domains/users-service";
import { LoginInput } from "../models/modelsUsersLogin/login-input";
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


export const authRouter = Router()

authRouter.post('/login',
    validatorInputAuthRout,
    async( req: RequestInputBody<LoginInput>, res: Response ) => {
        const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
        if (!user) return res.sendStatus(401)

            const accessToken = await jwtService.createJWTAccessToken(user._id)
            const refreshToken = await jwtService.createJWTRefreshToken(user._id)
            return res
                .status(200)
                .cookie('refreshToken', refreshToken, refreshCookieOptions)
                .send(accessToken)
    })
authRouter.post('/refresh-token',refreshTokenAuthentication,
    async( req: Request,/*todo*/ res: Response ) => {
            const accessToken = await jwtService.createJWTAccessToken(req.userDB!._id)
            const newRefreshToken = await jwtService.createJWTRefreshToken(req.userDB!._id)
                return res.status(200)
                          .cookie('refreshToken', newRefreshToken, refreshCookieOptions)
                          .send(accessToken)
    })
authRouter.post('/logout', refreshTokenAuthentication,
    async( req: Request,/*todo*/ res: Response ) => {
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
        const user = await usersQueryRepository.getUserInfo(req.userView!.id)
        if (user) {
            res.send(user)
            return
        }
    })
