import {
    DeleteResult,
    InsertOneResult,
} from "mongodb";
import {
    sessionsCollection
} from "../../database/runDB";
import { DeviceAuthSessionsDBModel } from "../../models/modelsDevice/device-input";
import { deviceSessionMapping } from "../../functions/deviceSessionMapping";
import { DeviceView } from "../../models/modelsDevice/device-view";

export const devicesSessionsRepository = {
    async testingDeleteAllSessions (): Promise<DeleteResult> {
        return await sessionsCollection.deleteMany({})
    },
    async findDeviceSession ( issuedAt: number ): Promise<DeviceView | null> {
       const deviceSession =  await sessionsCollection.findOne({ issuedAt: issuedAt })
        if(!deviceSession) return null
        return deviceSessionMapping(deviceSession)
    },
    async addDeviceSession ( deviceSession:DeviceAuthSessionsDBModel ):  Promise<InsertOneResult<DeviceAuthSessionsDBModel>>{
        return await sessionsCollection.insertOne(deviceSession)
    },
    async updateDeviceSession( newIssuedAt: number, issuedAt: number ):  Promise<boolean>{
        const result = await sessionsCollection.updateOne({issuedAt: issuedAt}, {$set: {issuedAt: newIssuedAt}})
        return result.matchedCount === 1
    },
    async deleteDeviceSessionByIAT (issuedAt: number): Promise<boolean> {
        const result = await sessionsCollection.deleteOne({ issuedAt: issuedAt })
        return result.deletedCount === 1
    },
}