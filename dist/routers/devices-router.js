"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.devicesRouter = void 0;
const express_1 = require("express");
const user_authentication_1 = require("../middlewares/guard-authentication/user-authentication");
const devices_sessions_repository_1 = require("../repositories/db/devices-sessions-repository");
const devices_service_1 = require("../domains/devices-service");
exports.devicesRouter = (0, express_1.Router)();
exports.devicesRouter.get('/devices', user_authentication_1.refreshTokenAuthentication, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId.toString();
    const devicesSessionsByUser = yield devices_sessions_repository_1.devicesSessionsRepository.findDevicesSessionsByUserId(userId);
    res.send(devicesSessionsByUser);
}));
exports.devicesRouter.delete('/devices', user_authentication_1.refreshTokenAuthentication, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId.toString();
    yield devices_service_1.devicesSessionsService.logoutDevicesSessionsByUser(req.issuedAt, userId);
    res.sendStatus(204);
    return;
}));
exports.devicesRouter.delete('/devices/:deviceId', user_authentication_1.refreshTokenAuthentication, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deviceId = req.params.deviceId;
    const userId = req.userId.toString();
    const logoutDeviceSession = yield devices_service_1.devicesSessionsService.logoutDeviceSessionByDeviceId(deviceId, userId);
    if (logoutDeviceSession === null) {
        res.sendStatus(404);
        return;
    }
    if (!logoutDeviceSession) {
        res.sendStatus(403);
        return;
    }
    res.sendStatus(204);
    return;
}));
