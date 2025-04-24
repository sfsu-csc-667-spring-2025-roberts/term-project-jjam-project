import express from "express";
import { Request, Response } from "express";
import { getLobbies, getLobby, saveLobby, deleteLobby } from "../db/games";
import crypto from "crypto";
//For Key making im testing this out
const router = express.Router();

// List all lobbies (GET /lobby/list)
router.get("/list", (req: Request, res: Response) => {
    // Only send minimal info
    const lobbies = getLobbies().map(l => ({
        id: l.id,
        name: l.name,
        host: l.host,
        players: l.players.length,
        started: l.started
    }));
    res.json(lobbies);
});

// Create a lobby (POST /lobby/create)
router.post("/create", (req: Request, res: Response) => {
    const user = (req.session && (req.session as any).user) as { id: string; email: string; gravatar?: string } | undefined;
    if (!user) return res.status(401).json({ error: "Not authenticated" });
    const id = crypto.randomUUID();
    const lobby = {
        id,
        name: req.body.name || `Lobby ${id.slice(0,4)}`,
        host: user.id,
        players: [user.id],
        created: Date.now(),
        started: false,
        chat: []
    };
    saveLobby(lobby);
    res.json({ ok: true, lobby });
});

// Join a lobby (POST /lobby/join)
router.post("/join", (req: Request, res: Response) => {
    const user = (req.session && (req.session as any).user) as { id: string; email: string; gravatar?: string } | undefined;
    if (!user) return res.status(401).json({ error: "Not authenticated" });
    const lobby = getLobby(req.body.lobbyId);
    if (!lobby) return res.status(404).json({ error: "Lobby not found" });
    if (!lobby.players.includes(user.id)) {
        lobby.players.push(user.id);
        saveLobby(lobby);
    }
    res.json({ ok: true, lobby });
});

// Leave a lobby (POST /lobby/leave)
router.post("/leave", (req: Request, res: Response) => {
    const user = (req.session && (req.session as any).user) as { id: string; email: string; gravatar?: string } | undefined;
    if (!user) return res.status(401).json({ error: "Not authenticated" });
    const lobby = getLobby(req.body.lobbyId);
    if (!lobby) return res.status(404).json({ error: "Lobby not found" });
    lobby.players = lobby.players.filter(pid => pid !== user.id);
    if (lobby.players.length === 0) deleteLobby(lobby.id);
    else saveLobby(lobby);
    res.json({ ok: true });
});

// Lobby chat (POST /lobby/chat)
router.post("/chat", (req: Request, res: Response) => {
    const user = (req.session && (req.session as any).user) as { id: string; email: string; gravatar?: string } | undefined;
    if (!user) return res.status(401).json({ error: "Not authenticated" });
    const lobby = getLobby(req.body.lobbyId);
    if (!lobby) return res.status(404).json({ error: "Lobby not found" });
    lobby.chat.push({ user: user.id, message: req.body.message, time: Date.now() });
    saveLobby(lobby);
    res.json({ ok: true });
});

// Render lobby page (GET /lobby)
router.get("/", (req: Request, res: Response) => {
    const user = (req.session && (req.session as any).user) as { id: string; email: string; gravatar?: string } | undefined;
    if (!user) return res.redirect("/login");
    res.render("lobby", { user });
});

export default router;
