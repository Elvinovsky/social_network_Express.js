import {body} from "express-validator";
import {checkForErrors} from "../check-for-errors";
import {userAuthentication} from "../guard-authentication/user-authentication";

export const checkInputContent =  body ( 'content')
    .trim()
    .isLength({ min: 20, max: 300 })
    .withMessage("length should be no more than 300 characters")
    .bail()
    .isString()
    .withMessage("is not a string")

export const validatorInputComment = [
    checkInputContent,
    checkForErrors,
    userAuthentication
]