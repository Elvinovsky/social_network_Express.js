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
exports.authRouter = void 0;
const express_1 = require("express");
const users_service_1 = require("../domains/users-service");
const check_bodyUser_1 = require("../middlewares/body-validator/check-bodyUser");
const jwt_service_1 = require("../application/jwt-service");
const user_authentication_1 = require("../middlewares/guard-authentication/user-authentication");
const users_query_repository_1 = require("../repositories/queryRepository/users-query-repository");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post('/login', check_bodyUser_1.validatorInputAuthRout, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_service_1.usersService.checkCredentials(req.body.loginOrEmail, req.body.password);
    if (user) {
        const token = yield jwt_service_1.jwtService.createJWT(user);
        res.status(200).send(token);
    }
    else {
        res.sendStatus(401);
        return;
    }
}));
exports.authRouter.get('/me', user_authentication_1.userAuthentication, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_query_repository_1.usersQueryRepository.getUserInfo(req.user.id);
    if (user) {
        res.send(user);
        return;
    }
}));
