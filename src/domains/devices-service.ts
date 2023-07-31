import { ObjectId } from "mongodb";
import { SessionDBModel } from "../models/modelsDevice/device-input";
import add from "date-fns/add";
import { DevicesSessionsRepository } from "../repositories/db/devices-sessions-repository";
import {
    inject,
    injectable
} from "inversify";

@injectable()
export class DevicesService {
    constructor ( @inject(DevicesSessionsRepository) protected devicesSessionsRepository: DevicesSessionsRepository ) {
    }

    async createDeviceSession ( userId: ObjectId, deviceId: string, issuedAt: number, ip: string | null, deviceName?: string ) {
        const createDeviceSession: SessionDBModel = {
            deviceId: deviceId,
            issuedAt: issuedAt,
            userId: userId.toString(),
            ip: ip || null,
            title: deviceName || null,
            lastActiveDate: new Date().toISOString(),
            expirationDate: add(new Date(),
                {
                    seconds: 20
                    //minutes:20
                })
        }
        return await this.devicesSessionsRepository.addDeviceSession(createDeviceSession)

    }

    async updateIATByDeviceSession ( newIssuedAt: number, issuedAt: number ) {
        return await this.devicesSessionsRepository.updateDeviceSession(newIssuedAt,
            issuedAt)
    }

    async logoutDeviceSessionByDeviceId ( deviceId: string, userId: string ) {
        const findDeviceSessionById = await this.devicesSessionsRepository.findDeviceIdAmongSessions(deviceId)
        if (!findDeviceSessionById) {
            return null
        }
        return await this.devicesSessionsRepository.deleteDeviceSessionSpecified(deviceId,
            userId)
    }

    async logoutDevicesSessionsByUser ( issuedAt: number, userId: string ) {
        const result = this.devicesSessionsRepository.deleteDevicesSessionsByUser(issuedAt,
            userId)
        return result
    }
}
