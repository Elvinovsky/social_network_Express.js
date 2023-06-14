import { body } from 'express-validator'
import { checkForErrors } from "../check-for-errors";
import { superAdminAuthentication } from "../guard-authentication/super-admin-authentication";

const checkInputName = body('name',)
    .trim()
    .isLength({
        min: 3,
        max: 15
    })
    .withMessage("length should be no more than 15 characters")
    .bail()
    .isString()
    .withMessage("is not a string")
const checkInputWebsiteUrl = body('websiteUrl')
    .matches(/^(http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/)
    .withMessage("is not a link to the site")
    .bail()
    .isString()
    .withMessage("is not a string")
    .isLength({
        min: 10,
        max: 100
    })
    .withMessage("must be at least 100 chars long")
const checkInputDescription = body('description')
    .trim()
    .isLength({
        min: 3,
        max: 500
    })
    .withMessage("length should be no more than 500 characters")
    .bail()
    .isString()
    .withMessage("is not a string")


export const validatorBlogInputBody = [superAdminAuthentication, checkInputName, checkInputWebsiteUrl, checkInputDescription, checkForErrors]