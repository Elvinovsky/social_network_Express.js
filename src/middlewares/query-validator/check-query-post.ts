import {query} from "express-validator";

export const checkQueryTitle =  query('title', )
    .isLength({ max: 30 })
    .withMessage( "length should be no more than 15 characters")
    .bail()
    .isString()
    .withMessage("is not a string")