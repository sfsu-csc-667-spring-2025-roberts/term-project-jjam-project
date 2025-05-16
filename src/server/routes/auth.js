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
const express_1 = __importDefault(require("express"));
const db_1 = require("../db"); //take all inputs from register and export them as a default object
//import db from "../db/connection";
const router = express_1.default.Router();
router.get("/register", (_request, response) => __awaiter(void 0, void 0, void 0, function* () {
    response.render("auth/register");
}));
router.post("/register", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = request.body;
    try {
        const user = yield db_1.User.register(email, password);
        //response.json({user});
        //@ts-ignore
        request.session.user = user;
        response.redirect("/lobby");
    }
    catch (error) {
        console.error("Error registering user:", error);
        response.render("auth/register", { error: "Invalid credentials", email });
    }
}));
router.get("/login", (_request, response) => __awaiter(void 0, void 0, void 0, function* () {
    response.render("auth/login");
}));
router.post("/login", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = request.body;
    try {
        const user = yield db_1.User.login(email, password);
        //response.json({user});
        //@ts-ignore
        request.session.user = user;
        response.redirect("/lobby");
    }
    catch (error) {
        console.error("Error logging in user:", error);
        response.render("auth/login", { error: "Invalid credentials", email });
    }
}));
router.get("/logout", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    request.session.user = null;
    request.session.destroy(() => {
        //console.log("Session destroyed");
        //intentional no-op for now
    });
    response.redirect("/auth/login");
}));
exports.default = router;
