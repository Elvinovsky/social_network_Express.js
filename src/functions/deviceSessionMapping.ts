import { WithId } from "mongodb";
import { DeviceAuthSessionsDBModel } from "../models/modelsDevice/device-input";
import { DeviceView } from "../models/modelsDevice/device-view";

export const deviceSessionMapping = (deviceSession: WithId<DeviceAuthSessionsDBModel>): DeviceView => {
    return {
        ip: (deviceSession.ip)? deviceSession.ip : 'ip',
        title: (deviceSession.title)? deviceSession.title : 'Device Name',
        lastActiveDate: deviceSession.lastActiveDate,
        deviceId: deviceSession._id.toString()
    }
}
export const devicesSessionsMapping = (array: Array<WithId<DeviceAuthSessionsDBModel>>): DeviceView[] => {
    return array.map((el) => {
        return {
            ip: (el.ip)? el.ip : 'ip',
            title: (el.title)? el.title : 'Device Name',
            lastActiveDate: el.lastActiveDate,
            deviceId: el._id.toString()
        }
    })
}