import { body } from 'express-validator'
import {postsRepository} from "../../repositories/db/posts-db-repository";


export const checksTitle =  body('title', )
    .exists()
    .trim()
    .isLength({min: 3, max: 30 })
    .withMessage("length should be no more than 30 characters")
    .bail()
    .isString()
    .withMessage("is not a string")
export const checksShortDescription =  body('shortDescription')
    .trim()
    .isLength({min: 3, max: 100 })
    .withMessage("must be at least 100 chars long")
    .bail()
    .isString()
    .withMessage("is not a string")
export const checksContent =  body('content')
    .trim()
    .isLength({ min: 3, max: 1000 })
    .withMessage("length should be no more than 1000 characters")
    .bail()
    .isString()
    .withMessage("is not a string")
export const checksBlogId =  body('blogId')
    .isString()
    .withMessage("is not a string")
    .bail()
    .custom(async (blogId) => {
        const validationBlogId = await postsRepository.searchBlogIdForPost(blogId)
        if (!validationBlogId) {
            throw new Error("blogId not found");
        }
    });







