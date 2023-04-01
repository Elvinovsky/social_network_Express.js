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
exports.usersRouter = void 0;
const express_1 = require("express");
const users_service_1 = require("../domains/users-service");
const check_bodyUser_1 = require("../middlewares/body-validator/check-bodyUser");
const users_query_repository_1 = require("../repositories/queryRepository/users-query-repository");
const guard_authentication_1 = require("../middlewares/guard-authentication");
const posts_router_1 = require("./posts-router");
exports.usersRouter = (0, express_1.Router)();
exports.usersRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const getAllUsers = yield users_query_repository_1.usersQueryRepository.returnOfAllUsers(req.query.searchEmailTerm, req.query.searchLoginTerm, req.query.pageNumber, req.query.pageSize, req.query.sortBy, req.query.sortDirection);
    return getAllUsers === null
        ? res.status(404).send("Users not found")
        : res.send(getAllUsers);
}));
exports.usersRouter.post('/', check_bodyUser_1.validatorInputUserBody, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = yield users_service_1.usersService.createUser(req.body.login, req.body.password, req.body.email);
    res.status(201).send(newUser);
    return;
}));
exports.usersRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const getByIdUser = yield users_service_1.usersService.findUserById(req.params.id);
    return getByIdUser === null
        ? res.sendStatus(404)
        : res.send(getByIdUser);
}));
posts_router_1.postsRouter.delete('/:id', guard_authentication_1.guardAuthentication, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const foundUserDelete = yield users_service_1.usersService.userByIdDelete(req.params.id);
    if (!foundUserDelete) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204);
    return;
}));
