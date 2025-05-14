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
        pgm.createTable('users', {
            id: 'id',
            email: {
                type: "varchar(100)",
                notNull: true,
                unique: true,
            },
            password: {
                type: "varchar(100)",
                notNull: true,
            },
            created_at: {
                type: 'timestamp',
                notNull: true,
                default: pgm.func('now()'),
            },
            updated_at: {
                type: 'timestamp',
                notNull: true,
                default: pgm.func('now()'),
            },
        });
    });
}
function down(pgm) {
    return __awaiter(this, void 0, void 0, function* () {
        pgm.dropTable("users");
    });
}
