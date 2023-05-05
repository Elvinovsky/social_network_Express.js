import {
    DeleteResult,
    InsertOneResult,
    ObjectId,
    WithId,
} from "mongodb";
import {
    sessionsCollection
} from "../../database/runDB";
import { DeviceAuthSessionsDBModel } from "../../models/modelsDevice/device-input";
import {
    devicesSessionsMapping
} from "../../functions/deviceSessionMapping";
import { DeviceView } from "../../models/modelsDevice/device-view";

export const devicesSessionsRepository = {
    async testingDeleteAllSessions (): Promise<DeleteResult> {
        return await sessionsCollection.deleteMany({})
    },
    async findDeviceSessionByIAT ( issuedAt: number ): Promise<boolean> {
       const deviceSession =  await sessionsCollection.findOne({ issuedAt: issuedAt })
        return !!deviceSession
    },
    async findDeviceIdAmongSessions ( deviceID: string ): Promise<WithId<DeviceAuthSessionsDBModel> | null> {
        return  await sessionsCollection.findOne({ _id: new ObjectId(deviceID) })
    },
    async findDeviceSessionByUserId ( userId: string): Promise<WithId<DeviceAuthSessionsDBModel>[] | null> {
        return  await sessionsCollection.find({ userId: userId }).toArray()
    },
    async findDevicesSessionsByUserId ( userId: string ): Promise<DeviceView[] | null> {
        const devicesSessions =  await sessionsCollection.find({ userId: userId }).toArray()
        if(!devicesSessions) {
            return null
        }
        return devicesSessionsMapping(devicesSessions)
    },
    async addDeviceSession ( deviceSession:DeviceAuthSessionsDBModel ):  Promise<InsertOneResult<DeviceAuthSessionsDBModel>> {
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
    async deleteDeviceSessionSpecified (deviceId: string, userId: string): Promise<boolean> {
        const result = await sessionsCollection.deleteOne({ userId: userId, _id: new ObjectId(deviceId) })
        return result.deletedCount === 1
    },
    async deleteDevicesSessionsByUser (user: WithId<DeviceAuthSessionsDBModel>[]): Promise<boolean> {
        const result = await sessionsCollection.deleteMany(user)
        return result.deletedCount === 1
    },
}