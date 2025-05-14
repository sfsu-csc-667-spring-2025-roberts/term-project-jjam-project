"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roomMiddleware = exports.authMiddleware = void 0;
var auth_1 = require("./auth");
Object.defineProperty(exports, "authMiddleware", { enumerable: true, get: function () { return __importDefault(auth_1).default; } });
var room_id_1 = require("./room-id");
Object.defineProperty(exports, "roomMiddleware", { enumerable: true, get: function () { return __importDefault(room_id_1).default; } });
