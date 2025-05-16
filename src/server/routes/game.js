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
const games_1 = require("../db/games");
const conditionallyJoinGame_1 = require("../db/conditionallyJoinGame");
const router = express_1.default.Router();
router.get("/:gameId", (req, res) => {
    const game = (0, games_1.getGame)(req.params.gameId);
    if (!game) {
        return res.status(404).json({ error: "Game not found" });
    }
    return res.json(game);
});
router.post("/:gameId/play", (req, res) => {
    res.json({ ok: true });
});
router.post("/:gameId/draw", (req, res) => {
    res.json({ ok: true });
});
router.post("/:gameId/chat", (req, res) => {
    const game = (0, games_1.getGame)(req.params.gameId);
    if (!game) {
        return res.status(404).json({ error: "Game not found" });
    }
    const { user, message } = req.body;
    game.chat.push({ user, message, time: Date.now() });
    (0, games_1.saveGame)(game);
    return res.json({ ok: true });
});
router.post("/:gameId/join", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const gameId = Number(req.params.gameId);
    const { userId, password } = req.body;
    if (!gameId || !userId || !password) {
        return res.status(400).json({ success: false, error: "Missing gameId, userId, or password" });
    }
    const result = yield (0, conditionallyJoinGame_1.conditionallyJoinGame)({ gameId, userId, password });
    if (result.success) {
        return res.json({ success: true, playerCount: result.playerCount });
    }
    else {
        return res.status(400).json(Object.assign({ success: false }, result));
    }
}));
router.post("/:gameId/leave", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const gameId = Number(req.params.gameId);
    const { userId } = req.body;
    if (!gameId || !userId) {
        return res.status(400).json({ success: false, error: "Missing gameId or userId" });
    }
    try {
        // Remove from game_players
        const result = yield req.app.get('db').result('DELETE FROM game_players WHERE game_id = $1 AND user_id = $2', [gameId, userId]);
        if (result.rowCount > 0) {
            return res.json({ success: true });
        }
        else {
            return res.status(400).json({ success: false, reason: "User not in game" });
        }
    }
    catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}));
exports.default = router;
