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
        pgm.createTable("game_users", {
            game_id: {
                type: "integer",
                notNull: true,
                references: "games",
                onDelete: "CASCADE"
            },
            user_id: {
                type: "integer",
                notNull: true,
                references: "users",
                onDelete: "CASCADE"
            },
            seat: {
                type: "serial",
            },
            is_current: {
                type: "boolean",
                notNull: true,
                default: false
            }
        });
    });
}
function down(pgm) {
    return __awaiter(this, void 0, void 0, function* () {
        pgm.dropTable("game_users");
    });
}
