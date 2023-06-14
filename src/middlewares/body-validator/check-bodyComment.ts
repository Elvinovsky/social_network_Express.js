import { body } from "express-validator";
import { checkForErrors } from "../check-for-errors";

export const checkInputContent = body('content')
    .trim()
    .isLength({
        min: 20,
        max: 300
    })
    .withMessage("length should be no more than 300 characters")
    .bail()
    .isString()
    .withMessage("is not a string")

export const checkInputLikeValue = body('likeStatus')
    .trim()
    .isString()
    .withMessage("is not a string")
    .bail()
    .matches( /^Like$|^Dislike$|^None$/)
    .withMessage("invalid value")
    .bail()


export const validatorInputComment = [checkInputContent, checkForErrors]