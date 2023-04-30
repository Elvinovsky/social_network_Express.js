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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.devicesSessionsService = void 0;
const add_1 = __importDefault(require("date-fns/add"));
const devices_sessions_repository_1 = require("../repositories/db/devices-sessions-repository");
exports.devicesSessionsService = {
    createDeviceSession(userId, deviceId, ip, deviceName) {
        return __awaiter(this, void 0, void 0, function* () {
            const createDeviceSession = {
                deviceId: deviceId.toString(),
                userId: userId.toString(),
                ip: ip || null,
                title: deviceName || null,
                lastActiveDate: new Date().toISOString(),
                expirationDate: (0, add_1.default)(new Date(), {
                    seconds: 20
                    //minutes:10
                })
            };
            return yield devices_sessions_repository_1.devicesSessionsRepository.addDeviceSession(createDeviceSession);
        });
    },
    updateDeviceSession(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield devices_sessions_repository_1.devicesSessionsRepository.updateDeviceSession(deviceId);
        });
    },
};
