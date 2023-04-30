"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deviceSessionMapping = void 0;
const deviceSessionMapping = (deviseSession) => {
    return {
        ip: deviseSession.ip ? deviseSession.ip : 'ip',
        title: deviseSession.title ? deviseSession.title : 'Device Name',
        lastActiveDate: deviseSession.lastActiveDate,
        deviceId: deviseSession.deviceId
    };
};
exports.deviceSessionMapping = deviceSessionMapping;
