"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.settings = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.settings = {
    MONGO_URI: process.env.MONGO_URL,
    JWT_SECRET: process.env.JWT_SECRET_KEY || '123',
    EMAIL: process.env.AUTH_EMAIL,
    PASS: process.env.AUTH_PASS
};
