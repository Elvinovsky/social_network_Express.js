import {
    Router,
} from "express";
import {
    checksConfirmationCode,
    checksEmailByCustom,
    checksEmailPattern,
    checksEmailResending,
    checksNewPassword,
    checksRecoveryCode,
    validatorBodyUserRegistration,
    validatorInputAuthRout
} from "../middlewares/body-validator/check-bodyUser";
import {
    refreshTokenAuthentication,
    userAuthentication
} from "../middlewares/guard-authentication/user-authentication";
import {
    checkForErrors,
    checkForEmailInDB
} from "../middlewares/check-for-errors";
import { ipLimiter } from "../middlewares/rateLimiter";
import { authController } from "../controllers/auths-controller";

export const authRouter = Router()


authRouter.post('/login',
    ipLimiter,
    validatorInputAuthRout,
    authController.createLogin)

authRouter.post('/refresh-token',
    refreshTokenAuthentication,
    authController.createRefToken)

authRouter.post('/logout',
    refreshTokenAuthentication,
    authController.logout)

authRouter.post('/registration',
    ipLimiter,
    validatorBodyUserRegistration,
    authController.registration)

authRouter.post('/registration-confirmation',
    ipLimiter,
    checksConfirmationCode,
    checkForErrors,
    authController.registrationConfirm)

authRouter.post('/registration-email-resending',
    ipLimiter,
    checksEmailResending,
    checkForErrors,
    authController.emailResending)

authRouter.post('/password-recovery',
    ipLimiter,
    checksEmailPattern,
    checkForErrors,
    checksEmailByCustom,
    checkForEmailInDB,)

authRouter.post('/new-password',
    ipLimiter,
    checksNewPassword,
    checksRecoveryCode,
    checkForErrors,
    authController.newPassword)

authRouter.get('/me',
    userAuthentication,
    authController.getMe)
