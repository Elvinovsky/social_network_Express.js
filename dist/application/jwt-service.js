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
exports.jwtService = {
    createJWTAccessToken(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = jsonwebtoken_1.default.sign({ userId: userId }, settings_1.settings.ACCESS_JWT_SECRET, { expiresIn: '10s' });
            return {
                accessToken: accessToken
            };
        });
    },
    createJWTRefreshToken(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return jsonwebtoken_1.default.sign({ userId: userId }, settings_1.settings.REFRESH_TOKEN_SECRET, { expiresIn: '20s' });
        });
    },
    getUserIdByAccessToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = jsonwebtoken_1.default.verify(token, settings_1.settings.ACCESS_JWT_SECRET);
                return new mongodb_1.ObjectId(userId.userId).toString();
            }
            catch (error) {
                return null;
            }
        });
    },
    getUserIdByRefreshToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = jsonwebtoken_1.default.verify(token, settings_1.settings.REFRESH_TOKEN_SECRET);
                return new mongodb_1.ObjectId(payload.userId).toString();
            }
            catch (error) {
                return null;
            }
        });
    },
    getIATByRefreshToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = jsonwebtoken_1.default.decode(token, { complete: true });
                debugger;
                return decoded.payload.iat;
            }
            catch (error) {
                return null;
            }
        });
    }
};
