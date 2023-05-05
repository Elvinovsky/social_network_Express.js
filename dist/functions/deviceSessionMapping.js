"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.devicesSessionsMapping = exports.deviceSessionMapping = void 0;
const deviceSessionMapping = (deviceSession) => {
    return {
        ip: (deviceSession.ip) ? deviceSession.ip : 'ip',
        title: (deviceSession.title) ? deviceSession.title : 'Device Name',
        lastActiveDate: deviceSession.lastActiveDate,
        deviceId: deviceSession._id.toString()
    };
};
exports.deviceSessionMapping = deviceSessionMapping;
const devicesSessionsMapping = (array) => {
    return array.map((el) => {
        return {
            ip: (el.ip) ? el.ip : 'ip',
            title: (el.title) ? el.title : 'Device Name',
            lastActiveDate: el.lastActiveDate,
            deviceId: el._id.toString()
        };
    });
};
exports.devicesSessionsMapping = devicesSessionsMapping;
