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
exports.authRouter = void 0;
const express_1 = require("express");
const users_service_1 = require("../domains/users-service");
const check_bodyUser_1 = require("../middlewares/body-validator/check-bodyUser");
const jwt_service_1 = require("../application/jwt-service");
const user_authentication_1 = require("../middlewares/guard-authentication/user-authentication");
const users_query_repository_1 = require("../repositories/queryRepository/users-query-repository");
const check_for_errors_1 = require("../middlewares/check-for-errors");
const cookie_helpers_1 = require("../helpers/cookie-helpers");
const request_ip_1 = __importDefault(require("request-ip"));
const devices_service_1 = require("../domains/devices-service");
const devices_sessions_repository_1 = require("../repositories/db/devices-sessions-repository");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post('/login', check_bodyUser_1.validatorInputAuthRout, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_service_1.usersService.checkCredentials(req.body.loginOrEmail, req.body.password);
    if (!user)
        return res.sendStatus(401);
    const accessToken = yield jwt_service_1.jwtService.createJWTAccessToken(user._id);
    const refreshToken = yield jwt_service_1.jwtService.createJWTRefreshToken(user._id);
    const ipAddress = request_ip_1.default.getClientIp(req);
    const deviceName = req.headers["user-agent"];
    const issuedAt = yield jwt_service_1.jwtService.getIATByRefreshToken(refreshToken);
    yield devices_service_1.devicesSessionsService.createDeviceSession(user._id, issuedAt, ipAddress, deviceName);
    return res
        .status(200)
        .cookie('refreshToken', refreshToken, cookie_helpers_1.refreshCookieOptions)
        .send(accessToken);
}));
exports.authRouter.post('/refresh-token', user_authentication_1.refreshTokenAuthentication, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = yield jwt_service_1.jwtService.createJWTAccessToken(req.userId);
    const newRefreshToken = yield jwt_service_1.jwtService.createJWTRefreshToken(req.userId);
    const newIssuedAt = yield jwt_service_1.jwtService.getIATByRefreshToken(newRefreshToken);
    yield devices_service_1.devicesSessionsService.updateIATByDeviceSession(newIssuedAt, req.issuedAt);
    return res.status(200)
        .cookie('refreshToken', newRefreshToken, cookie_helpers_1.refreshCookieOptions)
        .send(accessToken);
}));
exports.authRouter.post('/logout', user_authentication_1.refreshTokenAuthentication, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield devices_sessions_repository_1.devicesSessionsRepository.deleteDeviceSessionByIAT(req.issuedAt);
    return res.clearCookie('refreshToken').sendStatus(204);
}));
exports.authRouter.post('/registration', check_bodyUser_1.validatorBodyUserRegistration, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_service_1.usersService.independentUserRegistration(req.body.login, req.body.password, req.body.email);
    if (user) {
        res.sendStatus(204);
        return;
    }
    res.sendStatus(400);
}));
exports.authRouter.post('/registration-confirmation', check_bodyUser_1.checksConfirmationCode, check_for_errors_1.checkForErrors, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_service_1.usersService.confirmCode(req.body.code);
    if (user) {
        res.sendStatus(204);
        return;
    }
    res.sendStatus(400);
}));
exports.authRouter.post('/registration-email-resending', check_bodyUser_1.checksEmailResending, check_for_errors_1.checkForErrors, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_service_1.usersService.emailConfirmation(req.body.email);
    if (user) {
        res.sendStatus(204);
        return;
    }
    res.sendStatus(400);
    return;
}));
exports.authRouter.get('/me', user_authentication_1.userAuthentication, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_query_repository_1.usersQueryRepository.getUserInfo(req.user.id);
    if (user) {
        res.send(user);
        return;
    }
}));
