"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_session_1 = __importDefault(require("express-session"));
const connect_pg_simple_1 = __importDefault(require("connect-pg-simple"));
//let sessionMiddleware: RequestHandler | undefined
const configureSession = (app) => {
    const store = new ((0, connect_pg_simple_1.default)(express_session_1.default))({
        createTableIfMissing: true,
    });
    const sessionMiddleware = (0, express_session_1.default)({
        store,
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: false
        // store: new (connectPgSimple(session))({
        //     createTableIfMissiong: true;
        // })
    });
    app.use(sessionMiddleware);
    return sessionMiddleware;
};
exports.default = configureSession;
//export { sessionMiddleware };
