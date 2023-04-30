import { WithId } from "mongodb";
import { DeviceAuthSessionsDBModel } from "../models/modelsDevice/device-input";
import { DeviceView } from "../models/modelsDevice/device-view";

export const deviceSessionMapping = (deviceSession: WithId<DeviceAuthSessionsDBModel>): DeviceView => {
    return {
        ip: deviceSession.ip? deviceSession.ip: 'ip',
        title: deviceSession.title? deviceSession.title : 'Device Name',
        lastActiveDate: deviceSession.lastActiveDate,
        deviceId: deviceSession._id.toString()
    }
}