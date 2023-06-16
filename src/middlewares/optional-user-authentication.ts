import {
    NextFunction,
    Request,
    Response
} from "express";
import {
    jwtService,
    usersService
} from "../compositions-root";

export const optionalUserAuth = (async( req: Request, res: Response, next: NextFunction ) => {
    if (!req.headers.authorization) {
        next()
        return
    }
    const token = (req.headers.authorization).split(' ')[1]

    const userId = await jwtService.getUserIdByAccessToken(token)
    if (userId) {
        req.user = await usersService.findUserById(userId)
        next()
        return
    } else{
        next()
        return
    }
})