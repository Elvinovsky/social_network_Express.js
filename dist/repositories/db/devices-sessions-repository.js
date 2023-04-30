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
exports.devicesSessionsRepository = void 0;
const runDB_1 = require("../../database/runDB");
const devaceSessionMapping_1 = require("../../functions/devaceSessionMapping");
exports.devicesSessionsRepository = {
    testingDeleteAllSessions() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield runDB_1.sessionsCollection.deleteMany({});
        });
    },
    findDeviceSession(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const deviceSession = yield runDB_1.sessionsCollection.findOne({ deviceId: deviceId });
            if (!deviceSession)
                return null;
            return (0, devaceSessionMapping_1.deviceSessionMapping)(deviceSession);
        });
    },
    addDeviceSession(deviceSession) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield runDB_1.sessionsCollection.insertOne(deviceSession);
        });
    },
    updateDeviceSession(deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield runDB_1.sessionsCollection.updateOne({ deviceId: deviceId.toString() }, { $set: { deviceId: deviceId.toString() } });
            return result.matchedCount === 1;
        });
    }
};
