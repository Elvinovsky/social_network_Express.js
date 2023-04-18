import {NextFunction, Request, Response} from "express";
import {jwtService} from "../../application/jwt-service";
import {usersService} from "../../domains/users-service";


export const userAuthentication = (async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.sendStatus(401)
        return
    }
    const token = (req.headers.authorization).split(' ')[1]

    const userId = await jwtService.getUserIdByAccessToken(token)
    if (userId) {
        req.user = await usersService.findUserById(userId)
        next()
    }else {
        res.status(401).send('Authentication required.') // custom message
        return
    }
    // -----------------------------------------------------------------------

})