import {checkForErrors} from "../check-for-errors";
import {body} from "express-validator";
import {guardAuthentication} from "../guard-authentication";


const checksLogin =  body('login', )
    .matches(/^[a-zA-Z0-9_-]*$/)
    .withMessage("matches incorrect")
    .bail()
    .isString()
    .withMessage("is not a string")
    .bail()
    .isLength({min: 3, max: 10 })
    .withMessage("length should be no more than 10 characters")


const checksPassword =  body('password')
    .trim()
    .isLength({min: 6, max: 20 })
    .withMessage("must be at least 20 chars long")
    .bail()
    .isString()
    .withMessage("is not a string")
const checkInputEmail =  body('email')
    .matches( /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .withMessage("is not a link to the email")
    .bail()
    .isString()
    .withMessage("is not a string")

export const validatorInputUserBody = [
    guardAuthentication,
    checksLogin,
    checksPassword,
    checkInputEmail,
    checkForErrors
]