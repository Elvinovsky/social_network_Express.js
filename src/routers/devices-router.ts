import {Response, Request, Router } from "express";
import { refreshTokenAuthentication } from "../middlewares/guard-authentication/user-authentication";
import { devicesSessionsRepository } from "../repositories/db/devices-sessions-repository";
import { devicesSessionsService } from "../domains/devices-service";

export const devicesRouter = Router();

devicesRouter.get('/devices', refreshTokenAuthentication, async ( req: Request, res: Response) => {
    const userId = req.userId.toString()
    const devicesSessionsByUser = await devicesSessionsRepository.findDevicesSessionsByUserId(userId)
    res.send(devicesSessionsByUser)
    })
devicesRouter.delete('/devices', refreshTokenAuthentication,
    async ( req: Request, res: Response) => {
        const userId = req.userId.toString()
        await devicesSessionsService.logoutDevicesSessionsByUser(req.issuedAt, userId)
        res.sendStatus(204)
        return
    })
devicesRouter.delete('/devices/:deviceId', refreshTokenAuthentication,
    async ( req: Request, res: Response) => {
        const deviceId = req.params.deviceId
        const logoutDeviceSession = await devicesSessionsService.logoutDeviceSessionByDeviceId(deviceId, req.issuedAt)
            if(logoutDeviceSession === null) {
               res.sendStatus(404)
               return
            }
            if(!logoutDeviceSession){
                res.sendStatus(403)
                return
            }
            res.sendStatus(204)
            return
    })