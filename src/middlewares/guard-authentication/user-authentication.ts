import {NextFunction, Request, Response} from "express";
import {jwtService} from "../../application/jwt-service";
import {usersService} from "../../domains/users-service";
import { usersRepository } from "../../repositories/db/users-db-repository";
import { devicesSessionsRepository } from "../../repositories/db/devices-sessions-repository";


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
})

export const refreshTokenAuthentication = (async (req: Request, res: Response, next: NextFunction) => {

    const refreshToken: string = req.cookies['refreshToken']
    if (!refreshToken) {
        return res.sendStatus(401)
    }
    const issuedAt = await jwtService.getIATByRefreshToken(refreshToken)
    debugger
    if (!issuedAt) {
        return res.sendStatus(401)
    }

    const checkDeviceSession = await devicesSessionsRepository.findDeviceSession(issuedAt)
    if(!checkDeviceSession) {
        return res.sendStatus(401)
    }

    const userIdByToken = await jwtService.getUserIdByRefreshToken(refreshToken)
    if (!userIdByToken) {
        return res.status(401).send('Authentication required.')
    }

    const userDB = await usersRepository.findUserById(userIdByToken)
    if(!userDB){
        return res.sendStatus(401)
    }

    req.userId = userDB._id
    req.issuedAt = issuedAt
    return next()

})