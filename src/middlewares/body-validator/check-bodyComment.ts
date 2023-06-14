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
    .isLength({ min: 4, max: 7})
    .matches( /^Like$|^Dislike$|^None$/)
    /*.custom(likeStatus => {
        const statusesValue = Object.values(Status)
        if (!statusesValue.includes(likeStatus)) {
            throw new Error("invalid Value");
        }
    })*/

export const validatorInputComment = [checkInputContent, checkForErrors]