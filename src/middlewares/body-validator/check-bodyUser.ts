import { checkForErrors } from "../check-for-errors";
import { body } from "express-validator";
import { superAdminAuthentication } from "../guard-authentication/super-admin-authentication";
import { usersRepository } from "../../repositories/db/users-db-repository";


const checksLogin = body('login',)
    .matches(/^[a-zA-Z0-9_-]*$/)
    .withMessage("matches incorrect")
    .bail()
    .isString()
    .withMessage("is not a string")
    .bail()
    .isLength({
        min: 3,
        max: 10
    })
    .withMessage("length should be no more than 10 characters")
    .custom(async( login: string ) => {
        const validationLogin = await usersRepository.findByLoginOrEmail(login)
        if (validationLogin) {
            throw new Error("a user with this username already exists");
        }
    });
export const checksPassword = body('password')
    .trim()
    .isLength({
        min: 6,
        max: 20
    })
    .withMessage("must be at least 20 chars long")
    .bail()
    .isString()
    .withMessage("is not a string")
export const checksNewPassword = body('newPassword')
    .trim()
    .isLength({
        min: 6,
        max: 20
    })
    .withMessage("must be at least 20 chars long")
    .bail()
    .isString()
    .withMessage("is not a string")
const checksEmail = body('email')
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .withMessage("is not a link to the email")
    .bail()
    .isString()
    .withMessage("is not a string")
    .custom(async( email: string ) => {
        const validationEmail = await usersRepository.findByLoginOrEmail(email)
        if (validationEmail) {
            throw new Error("your mailing address is already registered");
        }
    });
export const checksEmailResending = body('email')
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .withMessage("is not a link to the email")
    .bail()
    .isString()
    .withMessage("is not a string")
    .custom(async( email: string ) => {
        const validationEmail = await usersRepository.findByLoginOrEmail(email)
        if (!validationEmail || validationEmail.emailConfirmation.isConfirmed) {
            throw new Error("your mailing address is already registered");
        }
    });
export const checksEmailForPasswordRecovery = body('email')
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .withMessage("is not a link to the email")
    .bail()
    .isString()
    .withMessage("is not a string")
    .custom(async( email: string ) => {
        const validationEmail = await usersRepository.findByLoginOrEmail(email)
        if (!validationEmail || !validationEmail.emailConfirmation.isConfirmed) {
            throw new Error("your email is unconfirmed");
        }
    });
const checkInputLoginOrEmail = body('loginOrEmail')//todo доделать
    .isString()
    .withMessage("is not a string")

export const checksConfirmationCode = body('code',)
    .isString()
    .withMessage("is not a string")
    .custom(async( code: string ) => {
        const isValidConfirmed = await usersRepository.findUserConfirmCode(code)
        if (!isValidConfirmed || isValidConfirmed.emailConfirmation.expirationDate < new Date() || isValidConfirmed.emailConfirmation.isConfirmed) {
            throw new Error("confirmation code is incorrect, expired or already been applied");
        }
    })
export const checksRecoveryCode = body('recoveryCode')
    .isString()
    .withMessage("is not a string")
    .custom(async( recoveryCode: string ) => {
        const isValidConfirmed = await usersRepository.findUserConfirmCode(recoveryCode)
        if (!isValidConfirmed) {
            throw new Error("confirmation code is incorrect");
        }

        if (isValidConfirmed.emailConfirmation.expirationDate < new Date()) {
            throw new Error("confirmation code is expired")
        }
        if (isValidConfirmed.emailConfirmation.isConfirmed) {
            throw new Error("confirmation code has already been applied");
        }
    })


export const validatorUserBodyRegistrationForSuperAdmin = [superAdminAuthentication, checksLogin, checksPassword, checksEmail, checkForErrors]

export const validatorInputAuthRout = [checkInputLoginOrEmail, checksPassword, checkForErrors]
export const validatorBodyUserRegistration = [checksLogin, checksPassword, checksEmail, checkForErrors]