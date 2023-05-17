import {Request, Response, NextFunction } from "express";
import {ValidationError, validationResult} from 'express-validator';

export const checkForErrors = ((req: Request, res: Response, next: NextFunction) => {
    const errorFormatter = ({ msg, param}: ValidationError) => {
        // Build your resulting errors however you want! String, object, whatever - it works!
        return {message: msg, field: param};
    };
    const error = validationResult(req).formatWith(errorFormatter);
    if (!error.isEmpty()) {
        return res.status(400).json({errorsMessages: error.array()})
    }
   return next()
})

export const checkForErrorsSendEmail = ((req: Request, res: Response, next: NextFunction) => {
    const invalid = validationResult(req)
    if (!invalid.isEmpty()) {
        return res.sendStatus(204)
    }
    return next()
})