import {
    DeleteResult,
    WithId,
} from "mongodb";
import { SessionDBModel } from "../../models/modelsDevice/device-input";
import {
    devicesSessionsMapping
} from "../../functions/deviceSessionMapping";
import { DeviceView } from "../../models/modelsDevice/device-view";
import { SessionModelClass } from "../../models/mongoose/models";
import mongoose from "mongoose";

export class DevicesSessionsRepository {
    async testingDeleteAllSessions (): Promise<DeleteResult> {
        return await SessionModelClass.deleteMany({})
    }
    async findDeviceSessionByIAT ( issuedAt: number ): Promise<boolean> {
        const deviceSession =  await SessionModelClass.findOne({ issuedAt: issuedAt })
        return !!deviceSession
    }
    async findDeviceIdAmongSessions ( deviceID: string ): Promise<WithId<SessionDBModel> | null> {
        return  await SessionModelClass.findOne({deviceId: deviceID })
    }
    async findDevicesSessionsByUserId ( userId: string ): Promise<DeviceView[] | null> {
        const devicesSessions =  await SessionModelClass.find({ userId: userId })
        if(!devicesSessions) {
            return null
        }
        return devicesSessionsMapping(devicesSessions)
    }
    async addDeviceSession ( deviceSession:SessionDBModel ):  Promise<mongoose.Document> {
        return await SessionModelClass.create(deviceSession)
    }
    async updateDeviceSession( newIssuedAt: number, issuedAt: number ):  Promise<boolean>{
        const updateActiveDAte = new Date().toISOString()
        const result = await SessionModelClass.updateOne(
            { issuedAt: issuedAt},
            { $set: {issuedAt: newIssuedAt, lastActiveDate: updateActiveDAte}})
        return result.matchedCount === 1
    }
    async deleteDeviceSessionByIAT (issuedAt: number): Promise<boolean> {
        const result = await SessionModelClass.deleteOne({ issuedAt: issuedAt })
        return result.deletedCount === 1
    }
    async deleteDeviceSessionSpecified (deviceId: string, userId: string): Promise<boolean> {
        const result = await SessionModelClass.deleteOne({ userId: userId, deviceId: deviceId })
        return result.deletedCount === 1
    }
    async deleteDevicesSessionsByUser (issuedAt: number, userId: string): Promise<boolean> {
        const result = await SessionModelClass.deleteMany({
            userId: userId,
            issuedAt: { $ne: issuedAt }, // исключаем документы с определенным значением issuedAt
            status: { $nin: ['closed', 'expired'] } // исключаем документы со статусами 'closed' и 'expired'
        })
        return result.deletedCount === 1
    }
}
