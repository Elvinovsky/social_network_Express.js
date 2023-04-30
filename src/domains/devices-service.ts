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
                    seconds: 20
                    //minutes:10
                })
            }
        return await devicesSessionsRepository.addDeviceSession(createDeviceSession)

    },
    async updateIATByDeviceSession ( newIssuedAt: number, issuedAt: number) {
        return await devicesSessionsRepository.updateDeviceSession(newIssuedAt, issuedAt)
    },
    async logoutDeviceSessionByDeviceId ( deviceId: string, issuedAt: number) {
        const findDeviceSessionById = await devicesSessionsRepository.findDeviceIdAmongSessions(deviceId)
            if(!findDeviceSessionById) {
                return null
            }
        return await devicesSessionsRepository.deleteDeviceSessionSpecified(deviceId, issuedAt)
    },
    async logoutDevicesSessionsByUser (issuedAt: number, userId: string) {
        const findDeviceSessionByUser = await devicesSessionsRepository.findDeviceSessionByUserId(userId)
        findDeviceSessionByUser?.forEach(el =>  {
           if (el.issuedAt !== issuedAt) {
             const result =  devicesSessionsRepository.deleteDevicesSessionsByUser(findDeviceSessionByUser)
               return result
           } else {
               return null
           }
        })
    }
}
