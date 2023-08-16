import {
    Router,
} from "express";
import {
    checksConfirmationEmail,
    checksEmailCustom,
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
    checkForEmailToDB
} from "../middlewares/check-for-errors";
import { ipLimiter } from "../middlewares/rateLimiter";
import { container } from "../compositions-root";
import { AuthController } from "../controllers/auths-controller";

const authController = container.resolve(AuthController)
export const authRouter = Router()


authRouter.post('/login',
    ipLimiter,
    validatorInputAuthRout,
    authController.createLogin.bind(authController))

authRouter.post('/refresh-token',
    refreshTokenAuthentication,
    authController.createRefToken.bind(authController))

authRouter.post('/logout',
    refreshTokenAuthentication,
    authController.logout.bind(authController))

authRouter.post('/registration',
    ipLimiter,
    validatorBodyUserRegistration,
    authController.registration.bind(authController))

authRouter.post('/registration-confirmation',
    ipLimiter,
    checksConfirmationEmail,
    checkForErrors,
    authController.registrationConfirm.bind(authController))

authRouter.post('/registration-email-resending',
    ipLimiter,
    checksEmailResending,
    checkForErrors,
    authController.emailResending.bind(authController))

authRouter.post('/password-recovery',
    ipLimiter,
    checkForErrors,
    checksEmailCustom,
    checkForEmailToDB,
    authController.passwordRecovery.bind(authController))

authRouter.post('/new-password',
    ipLimiter,
    checksNewPassword,
    checksRecoveryCode,
    checkForErrors,
    authController.newPassword.bind(authController))

authRouter.get('/me',
    userAuthentication,
    authController.getMe.bind(authController))
