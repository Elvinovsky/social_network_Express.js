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
exports.securityDevicesRouter = void 0;
const express_1 = require("express");
const user_authentication_1 = require("../middlewares/guard-authentication/user-authentication");
exports.securityDevicesRouter = (0, express_1.Router)();
exports.securityDevicesRouter.get('/devices', user_authentication_1.refreshTokenAuthentication, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
exports.securityDevicesRouter.delete('/devices', user_authentication_1.refreshTokenAuthentication, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
exports.securityDevicesRouter.delete('/devices/:deviceId', user_authentication_1.refreshTokenAuthentication, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
