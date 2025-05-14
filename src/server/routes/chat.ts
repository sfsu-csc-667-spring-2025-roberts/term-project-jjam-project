import express from "express";

import { Request, Response } from "express";

const router = express.Router();

import { getChat, addChatMessage } from "../db/games";

// GET /chat/:gameId - fetch chat history
router.get("/:gameId", (req: Request, res: Response) => {
    const { gameId } = req.params;
    const chat = getChat(gameId);
    res.json({ chat });
});

// POST /chat/:gameId - add new message
router.post("/:gameId", (req: Request, res: Response) => {
    const { gameId } = req.params;
    const { message } = req.body;
    // Fallback user if not logged in
    let user = "anonymous";
    if (req.session && req.session.user && req.session.user.id) {
        user = req.session.user.id;
    }
    if (!message) {
        res.status(400).send("Message is required");
        return;
    }
    const chatMsg = addChatMessage(gameId, user, message);
    const io = req.app.get("io");
    if (io) {
        io.to(`game_${gameId}`).emit("chatMessage", chatMsg);
    }
    res.status(200).json({ success: true, chatMsg });
});

export default router;

