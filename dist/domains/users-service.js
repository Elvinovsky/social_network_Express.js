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
const add_1 = __importDefault(require("date-fns/add"));
const uuid_1 = require("uuid");
const emails_manager_1 = require("../adapter/emails-manager");
exports.usersService = {
    userByAnAdminRegistration(login, password, email, ip) {
        return __awaiter(this, void 0, void 0, function* () {
            const hash = yield this._generateHash(password);
            const newUser = {
                login: login,
                passwordHash: hash,
                email: email,
                createdAt: new Date().toISOString(),
                emailConfirmation: {
                    confirmationCode: "not required",
                    expirationDate: "not required",
                    isConfirmed: true
                },
                geolocationData: {
                    ip: ip
                }
            };
            return yield users_db_repository_1.usersRepository.addNewUser(newUser);
        });
    },
    independentUserRegistration(login, password, email, ip) {
        return __awaiter(this, void 0, void 0, function* () {
            const hash = yield this._generateHash(password);
            const newUser = {
                login: login,
                passwordHash: hash,
                email: email,
                createdAt: new Date().toISOString(),
                emailConfirmation: {
                    confirmationCode: (0, uuid_1.v4)(),
                    expirationDate: (0, add_1.default)(new Date(), {
                        hours: 1,
                        minutes: 10
                    }),
                    isConfirmed: false
                },
                geolocationData: {
                    ip: ip
                }
            };
            const result = yield users_db_repository_1.usersRepository.addNewUser(newUser);
            try {
                yield emails_manager_1.emailsManager.sendEmailConformationMessage(newUser);
            }
            catch (error) {
                console.error(error);
                yield users_db_repository_1.usersRepository.userByIdDelete(result.id); // todo как все это обернуть
                return null;
            }
            return result;
        });
    },
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield users_db_repository_1.usersRepository.findUserById(id);
        });
    },
    confirmCode(code, ip) {
        return __awaiter(this, void 0, void 0, function* () {
            const isComparisonIP = yield users_db_repository_1.usersRepository.findUserConfirmCode(code);
            if (isComparisonIP.geolocationData.ip !== ip)
                return false; // todo доработатьб убрать в отдельный мидлвара?
            return yield users_db_repository_1.usersRepository.updateConfirmedCode(code);
        });
    },
    emailConfirmation(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const newCode = (0, uuid_1.v4)();
            const codeReplacement = yield users_db_repository_1.usersRepository.updateConfirmationCodeByEmail(email, newCode);
            if (!codeReplacement)
                return false;
            const user = yield users_db_repository_1.usersRepository.findByLoginOrEmail(email);
            if (!user || user.emailConfirmation.isConfirmed) {
                return false;
            } // todo слой мидлваре?
            try {
                yield emails_manager_1.emailsManager.sendEmailConformationMessage(user);
            }
            catch (error) {
                yield users_db_repository_1.usersRepository.userByIdDelete(user._id.toString());
                console.error(error);
                return false;
            }
            return true;
        });
    },
    checkCredentials(loginOrEmail, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_db_repository_1.usersRepository.findByLoginOrEmail(loginOrEmail);
            if (!user
                || !user.emailConfirmation.isConfirmed) {
                return null;
            }
            const isHashesEquals = yield this._isPasswordCorrect(password, user.passwordHash);
            if (isHashesEquals) {
                return user;
            }
            else {
                return null;
            }
        });
    },
    _generateHash(password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt_1.default.hash(password, 7);
        });
    },
    _isPasswordCorrect(password, hash) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt_1.default.compare(password, hash);
        });
    },
    userByIdDelete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield users_db_repository_1.usersRepository.userByIdDelete(id);
        });
    }
};
