import {Request, Response, NextFunction } from "express";
import { validationResult, ValidationError } from 'express-validator';
const errorFormatter = ({msg}: ValidationError) => {
        // Build your resulting errors however you want! String, object, whatever - it works!
        return {...msg};
    };

export const checkForErrors = ((req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req).formatWith(errorFormatter);
    if (!error.isEmpty()) {
        return res.status(400).json({errorsMessages: error.array()})
    }
   return next()
})