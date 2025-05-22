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
exports.CONDITIONALLY_JOIN_SQL = void 0;
exports.conditionallyJoinGame = conditionallyJoinGame;
const connection_1 = __importDefault(require("./connection"));
exports.CONDITIONALLY_JOIN_SQL = `
INSERT INTO game_players (game_id, user_id)
SELECT $(gameId), $(userId) 
WHERE NOT EXISTS (
  SELECT 'value-doesnt-matter' 
  FROM game_players 
  WHERE game_id=$(gameId) AND user_id=$(userId)
)
AND (
  SELECT COUNT(*) FROM games WHERE id=$(gameId) AND password=$(password)
) = 1
AND (
  (
    SELECT COUNT(*) FROM game_players WHERE game_id=$(gameId)
  ) < (
    SELECT max_players FROM games WHERE id=$(gameId)
  )
)
RETURNING (
  SELECT COUNT(*) FROM game_players WHERE game_id=$(gameId)
)
`;
function conditionallyJoinGame(_a) {
    return __awaiter(this, arguments, void 0, function* ({ gameId, userId, password }) {
        try {
            const result = yield connection_1.default.oneOrNone(exports.CONDITIONALLY_JOIN_SQL, { gameId, userId, password });
            if (!result) {
                return { success: false, reason: "Join conditions not met" };
            }
            return { success: true, playerCount: Object.values(result)[0] };
        }
        catch (error) {
            return { success: false, error };
        }
    });
}
