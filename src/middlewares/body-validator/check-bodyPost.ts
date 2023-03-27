import { body } from 'express-validator'
import {postsRepository} from "../../repositories/db/posts-db-repository";
import {guardAuthentication} from "../guard-authentication";
import {checkForErrors} from "../check-for-errors";


const checksTitle =  body('title', )
    .exists()
    .trim()
    .isLength({min: 3, max: 30 })
    .withMessage("length should be no more than 30 characters")
    .bail()
    .isString()
    .withMessage("is not a string")
const checksShortDescription =  body('shortDescription')
    .trim()
    .isLength({min: 3, max: 100 })
    .withMessage("must be at least 100 chars long")
    .bail()
    .isString()
    .withMessage("is not a string")
const checksContent =  body('content')
    .trim()
    .isLength({ min: 3, max: 1000 })
    .withMessage("length should be no more than 1000 characters")
    .bail()
    .isString()
    .withMessage("is not a string")
const checksBlogId =  body('blogId')
    .isString()
    .withMessage("is not a string")
    .bail()
    .custom(async (blogId: string) => {
        const validationBlogId = await postsRepository.searchBlogIdForPost(blogId)
        if (!validationBlogId) {
            throw new Error("blogId not found");
        }
    });



 export const validatorInputPostBody = [
       guardAuthentication,
       checksTitle,
       checksShortDescription,
       checksContent,
       checksBlogId,
       checkForErrors
  ]
export const validatorInputBlogPostBody = [
        guardAuthentication,
        checksTitle,
        checksShortDescription,
        checksContent,
        checkForErrors
   ]




