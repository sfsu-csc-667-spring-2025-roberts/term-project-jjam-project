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
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
function up(pgm) {
    return __awaiter(this, void 0, void 0, function* () {
        pgm.addColumns("users", {
            gravatar: {
                type: "VARCHAR(255)",
                notNull: true,
                default: null,
            },
        });
        //pgm.sql("UPDATE users SET gravatar = sha256(email)");
    });
}
function down(pgm) {
    return __awaiter(this, void 0, void 0, function* () {
        pgm.dropColumns("users", ["gravatar"]);
    });
}
