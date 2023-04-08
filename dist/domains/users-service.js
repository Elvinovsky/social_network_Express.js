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
exports.usersService = void 0;
const users_db_repository_1 = require("../repositories/db/users-db-repository");
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.usersService = {
    createUser(login, password, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const salt = yield bcrypt_1.default.genSalt(7);
            const hash = yield this.generateHash(password, salt);
            const newUser = {
                login: login,
                passwordHash: hash,
                passwordSalt: salt,
                email: email,
                createdAt: new Date().toISOString()
            };
            return yield users_db_repository_1.usersRepository.addNewUser(newUser);
        });
    },
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield users_db_repository_1.usersRepository.findUserById(id);
        });
    },
    checkCredentials(loginOrEmail, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_db_repository_1.usersRepository.findByLoginOrEmail(loginOrEmail);
            if (!user) {
                return null;
            }
            const passwordHash = yield this.generateHash(password, user.passwordSalt);
            if (user.passwordHash === passwordHash) {
                return user;
            }
            else {
                return null;
            }
        });
    },
    generateHash(password, passwordSalt) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt_1.default.hash(password, passwordSalt);
        });
    },
    userByIdDelete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield users_db_repository_1.usersRepository.userByIdDelete(id);
        });
    }
};
