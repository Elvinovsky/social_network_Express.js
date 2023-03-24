import { buildCheckFunction } from 'express-validator';


export const checkQueryName = buildCheckFunction(['query'])('name' )
    .trim()
    .isLength({max: 15 })
    .withMessage( "length should be no more than 15 characters")
    .bail()
    .isString()
    .withMessage("is not a string")

