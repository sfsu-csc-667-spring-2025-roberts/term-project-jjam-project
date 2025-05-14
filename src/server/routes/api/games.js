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
exports.apiGames = void 0;
const express_1 = __importDefault(require("express"));
const games_1 = require("../../db/games");
const router = express_1.default.Router();
// GET /api/games/:gameId/state - fetch game state JSON
router.get("/:gameId/state", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const game = (0, games_1.getGame)(req.params.gameId);
    if (!game) {
        res.status(404).json({ error: "Game not found" });
        return;
    }
    res.json(game);
}));
// POST /api/games/:gameId/state - update game state JSON
router.post("/:gameId/state", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const gameId = req.params.gameId;
    const state = req.body;
    if (!state || typeof state !== 'object') {
        res.status(400).json({ error: "Invalid state object" });
        return;
    }
    state.id = gameId; // Ensure id is set
    (0, games_1.saveGame)(state);
    res.json({ success: true });
}));
exports.apiGames = router;
