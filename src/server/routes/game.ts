import express from "express";
import { Request, Response } from "express";
import { getGame, saveGame, getLobby, saveLobby, GameState } from "../db/games";
import { conditionallyJoinGame } from "../db/conditionallyJoinGame";

const router = express.Router();

router.get("/:gameId", (req: Request, res: Response) => {
    const game = getGame(req.params.gameId);
    if (!game) {
        return res.status(404).json({ error: "Game not found" });
    }
    return res.json(game);
});

router.post("/:gameId/play", (req: Request, res: Response) => {
    res.json({ ok: true });
});

router.post("/:gameId/draw", (req: Request, res: Response) => {
    res.json({ ok: true });
});

router.post("/:gameId/chat", (req: Request, res: Response) => {
    const game = getGame(req.params.gameId);
    if (!game) {
        return res.status(404).json({ error: "Game not found" });
    }
    const { user, message } = req.body;
    game.chat.push({ user, message, time: Date.now() });
    saveGame(game);
    return res.json({ ok: true });
});

router.post("/:gameId/join", async (req: Request, res: Response) => {
    const gameId = Number(req.params.gameId);
    const { userId, password } = req.body;
    if (!gameId || !userId || !password) {
        return res.status(400).json({ success: false, error: "Missing gameId, userId, or password" });
    }
    const result = await conditionallyJoinGame({ gameId, userId, password });
    if (result.success) {
        return res.json({ success: true, playerCount: result.playerCount });
    } else {
        return res.status(400).json({ success: false, ...result });
    }
});

router.post("/:gameId/leave", async (req: Request, res: Response) => {
    const gameId = Number(req.params.gameId);
    const { userId } = req.body;
    if (!gameId || !userId) {
        return res.status(400).json({ success: false, error: "Missing gameId or userId" });
    }
    try {
        // Remove from game_players
        const result = await req.app.get('db').result(
            'DELETE FROM game_players WHERE game_id = $1 AND user_id = $2',
            [gameId, userId]
        );
        if (result.rowCount > 0) {
            return res.json({ success: true });
        } else {
            return res.status(400).json({ success: false, reason: "User not in game" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
