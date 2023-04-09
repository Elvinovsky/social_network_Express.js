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
exports.usersRepository = void 0;
const runDB_1 = require("../../database/runDB");
const mongodb_1 = require("mongodb");
function userMapping(user) {
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt
    };
}
exports.usersRepository = {
    testingDeleteAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield runDB_1.usersCollection.deleteMany({});
        });
    },
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield runDB_1.usersCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (!user) {
                return null;
            }
            return userMapping(user);
        });
    },
    findUserLoginForComment(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield runDB_1.usersCollection.findOne({ _id: new mongodb_1.ObjectId(userId) });
                const userLogin = user.login;
                return userLogin;
            }
            catch (error) {
                return null;
            }
        });
    },
    findByLoginOrEmail(loginOrEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield runDB_1.usersCollection.findOne({ $or: [{ login: loginOrEmail }, { email: loginOrEmail }] });
        });
    },
    addNewUser(newUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield runDB_1.usersCollection.insertOne(newUser);
            return {
                id: result.insertedId.toString(),
                login: newUser.login,
                email: newUser.email,
                createdAt: newUser.createdAt
            };
        });
    },
    userByIdDelete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteResult = yield runDB_1.usersCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
            return deleteResult.deletedCount === 1;
        });
    }
};
