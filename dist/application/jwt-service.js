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
exports.jwtService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const settings_1 = require("../settings");
const mongodb_1 = require("mongodb");
const users_db_repository_1 = require("../repositories/db/users-db-repository");
exports.jwtService = {
    createJWTAccessToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = jsonwebtoken_1.default.sign({ userId: new mongodb_1.ObjectId(user._id) }, settings_1.settings.ACCESS_JWT_SECRET, { expiresIn: '10s' });
            return {
                accessToken: accessToken
            };
        });
    },
    createJWTRefreshToken(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return jsonwebtoken_1.default.sign({ userId: new mongodb_1.ObjectId(user._id) }, settings_1.settings.REFRESH_TOKEN_SECRET, { expiresIn: '20s' });
        });
    },
    getUserIdByAccessToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = jsonwebtoken_1.default.verify(token, settings_1.settings.ACCESS_JWT_SECRET);
                return new mongodb_1.ObjectId(result.userId).toString();
            }
            catch (error) {
                return null;
            }
        });
    },
    getUserIdByRefreshToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const checkToken = jsonwebtoken_1.default.verify(token, settings_1.settings.REFRESH_TOKEN_SECRET);
                const userId = new mongodb_1.ObjectId(checkToken.userId).toString();
                const user = yield users_db_repository_1.usersRepository.findUserById(userId);
                return user;
            }
            catch (error) {
                return null;
            }
        });
    }
};
