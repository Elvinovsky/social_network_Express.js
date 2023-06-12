import {
    Request,
    Response
} from "express";
import {
    DevicesService
} from "../domains/devices-service";
import { DevicesSessionsRepository } from "../repositories/db/devices-sessions-repository";

export class DevicesController {

    constructor (protected devicesRepository: DevicesSessionsRepository,
                 protected devicesService: DevicesService) {
    }

    async getDevices ( req: Request, res: Response ) {
        const userId = req.userId.toString()
        const devicesSessionsByUser = await this.devicesRepository.findDevicesSessionsByUserId(userId)
        res.send(devicesSessionsByUser)
    }

    async deleteDevices ( req: Request, res: Response ) {
        const userId = req.userId.toString()
        await this.devicesService.logoutDevicesSessionsByUser(req.issuedAt,
            userId)
        res.sendStatus(204)
        return
    }

    async deleteDevicesById ( req: Request, res: Response ) {
        const deviceId = req.params.deviceId
        const userId = req.userId.toString()
        const logoutDeviceSession = await this.devicesService.logoutDeviceSessionByDeviceId(deviceId,
            userId)
        if (logoutDeviceSession === null) {
            res.sendStatus(404)
            return
        }
        if (!logoutDeviceSession) {
            res.sendStatus(403)
            return
        }
        res.sendStatus(204)
        return
    }
}

