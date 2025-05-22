import express from "express";
import { Request, Response } from "express";
import { getGame, saveGame } from "../../db/games";

const router = express.Router();

// GET /api/games/:gameId/state - fetch game state JSON
router.get("/:gameId/state", async (req, res): Promise<void> => {
    const game = getGame(req.params.gameId);
    if (!game) {
        res.status(404).json({ error: "Game not found" });
        return;
    }
    res.json(game);
});

// POST /api/games/:gameId/state - update game state JSON
router.post("/:gameId/state", async (req, res): Promise<void> => {
    const gameId = req.params.gameId;
    const state = req.body;
    if (!state || typeof state !== 'object') {
        res.status(400).json({ error: "Invalid state object" });
        return;
    }
    state.id = gameId; // Ensure id is set
    saveGame(state);
    res.json({ success: true });
});

export const apiGames = router;
