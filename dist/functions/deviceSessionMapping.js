"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deviceSessionMapping = void 0;
const deviceSessionMapping = (deviceSession) => {
    return {
        ip: deviceSession.ip ? deviceSession.ip : 'ip',
        title: deviceSession.title ? deviceSession.title : 'Device Name',
        lastActiveDate: deviceSession.lastActiveDate,
        deviceId: deviceSession._id.toString()
    };
};
exports.deviceSessionMapping = deviceSessionMapping;
