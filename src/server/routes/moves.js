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
// Handles game moves (play card, draw, etc.) and persists state after each move.
const express_1 = __importDefault(require("express"));
const db_1 = require("../db");
const router = express_1.default.Router();
// More realistic Crazy 8s move handler
router.post("/:gameId/move", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { gameId } = req.params;
    const { move } = req.body;
    let state = yield db_1.Game.loadState(Number(gameId));
    // Example: move = { playerId, cardPlayed, draw }
    if (move.cardPlayed) {
        // Remove the card from player's hand and add to discard pile
        state.discardPile = state.discardPile || [];
        state.discardPile.push(move.cardPlayed);
        state.players = state.players.map((p) => p.id === move.playerId
            ? Object.assign(Object.assign({}, p), { hand: p.hand.filter((card) => card !== move.cardPlayed) }) : p);
        state.lastAction = `Player ${move.playerId} played ${move.cardPlayed}`;
    }
    else if (move.draw) {
        // Add a card to player's hand
        const card = state.deck.pop();
        state.players = state.players.map((p) => p.id === move.playerId
            ? Object.assign(Object.assign({}, p), { hand: [...p.hand, card] }) : p);
        state.lastAction = `Player ${move.playerId} drew a card`;
    }
    // TODO: Add turn logic, win condition, etc.
    // Save updated state
    yield db_1.Game.saveState(Number(gameId), state);
    res.json({ success: true, state });
}));
exports.default = router;
