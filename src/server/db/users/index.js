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
//database stuff will be here
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const connection_1 = __importDefault(require("../connection"));
//what we need to do:
//register user
//create new record in the user table with email and encrypted password
//redirect the user to the lobby page
//return exception if a non unique email is attempted to be inserted into db
const register = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const sql = "INSERT INTO users (email, password, gravatar) VALUES($1, $2, $3) RETURNING id, gravatar";
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    const { id, gravatar } = yield connection_1.default.one(sql, [email, hashedPassword, crypto_1.default.createHash("sha256").update(email).digest("hex")]);
    return { id, gravatar, email };
});
//log in user
//check if the email and pasword exists in the user table
//to test in psql:
//insert into users (email, password) values ('testemail@test.com', 'password');
const login = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const sql = "SELECT * FROM users WHERE email = $1";
    const { id, gravatar, password: encryptedPassword } = yield connection_1.default.one(sql, [email]); //automatically throws errors for us
    // if (!user){
    //     throw new Error("User not found");
    // }
    const isValidPassword = yield bcrypt_1.default.compare(password, encryptedPassword);
    if (!isValidPassword) {
        throw new Error("Invalid credentials, try again");
    }
    return { id, gravatar, email };
});
exports.default = {
    register, login
};
