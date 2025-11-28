"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.default = {
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/trello-clone',
    jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_here',
    jwtExpire: process.env.JWT_EXPIRE || '7d',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
};
