import { WithId } from "mongodb";
import { SessionDBModel } from "../models/modelsDevice/device-input";
import { DeviceView } from "../models/modelsDevice/device-view";

export const devicesSessionsMapping = (array: Array<WithId<SessionDBModel>>): DeviceView[] => {
    return array.map((el) => {
        return {
            ip: (el.ip)? el.ip : 'ip',
            title: (el.title)? el.title : 'Device Name',
            lastActiveDate: el.lastActiveDate,
            deviceId: el.deviceId
        }
    })
}