import { v4 as uuidv4 } from "uuid"

export const createNewDeviceData = (userId: string, ip: string, title: string, deviceId: string) => {

    const newSessionId = uuidv4()
    return {
        userId,
        ip,
        title,
        deviceId: deviceId,
        lastActiveDate: new Date(),
        sessionId: newSessionId,
    }
}