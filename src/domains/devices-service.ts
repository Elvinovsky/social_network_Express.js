import { ObjectId } from "mongodb";
import { DeviceAuthSessionsDBModel } from "../models/modelsDevice/device-input";
import add from "date-fns/add";
import { devicesSessionsRepository } from "../repositories/db/devices-sessions-repository";

export const devicesSessionsService = {
    async createDeviceSession ( userId: ObjectId, issuedAt: number, ip: string | null, deviceName?: string ) {
        const createDeviceSession: DeviceAuthSessionsDBModel = {
            issuedAt: issuedAt,
            userId: userId.toString(),
                ip: ip || null,
                title: deviceName || null,
                lastActiveDate: new Date().toISOString(),
                expirationDate: add(new Date(), {
                    //seconds: 20
                    minutes:20
                })
            }
        return await devicesSessionsRepository.addDeviceSession(createDeviceSession)

    },
    async updateIATByDeviceSession ( newIssuedAt: number, issuedAt: number) {
        return await devicesSessionsRepository.updateDeviceSession(newIssuedAt, issuedAt)
    },
    async logoutDeviceSessionByDeviceId ( deviceId: string, userId: string) {
        const findDeviceSessionById = await devicesSessionsRepository.findDeviceIdAmongSessions(deviceId)
            if(!findDeviceSessionById) {
                return null
            }
        return await devicesSessionsRepository.deleteDeviceSessionSpecified(deviceId, userId)
    },
    async logoutDevicesSessionsByUser (issuedAt: number, userId: string) {
        const result =  devicesSessionsRepository.deleteDevicesSessionsByUser(issuedAt, userId)
               return result
    }
}
