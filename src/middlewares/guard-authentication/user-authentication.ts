import {NextFunction, Request, Response} from "express";
import {jwtService} from "../../application/jwt-service";
import {usersService} from "../../domains/users-service";
import { jwtDbRepository } from "../../repositories/db/jwt-db-repository";
import { usersRepository } from "../../repositories/db/users-db-repository";


export const userAuthentication = (async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.sendStatus(401)
        return
    }
    const token = (req.headers.authorization).split(' ')[1]

    const userId = await jwtService.getUserIdByAccessToken(token)
    if (userId) {
        req.userView = await usersService.findUserById(userId)
        next()
    }else {
        res.status(401).send('Authentication required.') // custom message
        return
    }
})

export const refreshTokenAuthentication = (async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies['refreshToken']
    if (!refreshToken) {
        return res.sendStatus(401)
    }
    const searchTokenInTokenList = await jwtDbRepository.findTokenByUserId(refreshToken)
    if (!searchTokenInTokenList) {
        return res.sendStatus(401)
    }
    const checkUser = await jwtService.getUserIdByRefreshToken(refreshToken)
    if (checkUser) {
        await jwtService.rootingToken(refreshToken) //todo протухание использованного токена.
        req.userDB = await usersRepository.findUserById(checkUser)
        return next()
    } else {
        return res.status(401).send('Authentication required.') // custom message
    }
})