"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settings = void 0;
exports.settings = {
    MONGO_URI: process.env.MONGO_URL || 'mongodb://0.0.0.0:27017',
    JWT_SECRET: process.env.JWT_SECRET || '123'
};
