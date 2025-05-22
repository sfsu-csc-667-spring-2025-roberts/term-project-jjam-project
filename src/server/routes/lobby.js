"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const games_1 = require("../db/games");
const crypto_1 = __importDefault(require("crypto"));
const router = express_1.default.Router();
// List all lobbies (GET /lobby/list)
router.get("/list", (req, res) => {
    const lobbies = (0, games_1.getLobbies)().map(l => ({
        id: l.id,
        name: l.name,
        host: l.host,
        players: l.players.length,
        players_list: l.players,
        started: l.started,
        chat: l.chat
    }));
    res.json(lobbies);
});
// Create a lobby (POST /lobby/create)
router.post("/create", (req, res) => {
    const user = (req.session && req.session.user);
    if (!user) {
        res.status(401).json({ error: "Not authenticated" });
    }
    else {
        const id = crypto_1.default.randomUUID();
        const lobby = {
            id,
            name: req.body.name || `Lobby ${id.slice(0, 4)}`,
            host: user.id,
            players: [user.id],
            created: Date.now(),
            started: false,
            chat: []
        };
        (0, games_1.saveLobby)(lobby);
        res.json({ success: true, lobby });
    }
});
// Join a lobby (POST /lobby/join)
router.post("/join", (req, res) => {
    const user = (req.session && req.session.user);
    if (!user) {
        res.status(401).json({ error: "Not authenticated" });
    }
    else {
        const lobby = (0, games_1.getLobby)(req.body.lobbyId);
        if (!lobby) {
            res.status(404).json({ error: "Lobby not found" });
        }
        else {
            if (!lobby.players.includes(user.id)) {
                lobby.players.push(user.id);
                (0, games_1.saveLobby)(lobby);
            }
            res.json({ success: true, lobby, playerCount: lobby.players.length });
        }
    }
});
// Leave a lobby (POST /lobby/leave)
router.post("/leave", (req, res) => {
    const user = (req.session && req.session.user);
    if (!user) {
        res.status(401).json({ error: "Not authenticated" });
    }
    else {
        const lobby = (0, games_1.getLobby)(req.body.lobbyId);
        if (!lobby) {
            res.status(404).json({ error: "Lobby not found" });
        }
        else {
            lobby.players = lobby.players.filter(pid => pid !== user.id);
            if (lobby.players.length === 0) {
                (0, games_1.deleteLobby)(lobby.id);
            }
            else {
                (0, games_1.saveLobby)(lobby);
            }
            res.json({ success: true });
        }
    }
});
// Lobby chat (POST /lobby/chat)
router.post("/chat", (req, res) => {
    const user = (req.session && req.session.user);
    if (!user) {
        res.status(401).json({ error: "Not authenticated" });
    }
    else {
        const lobby = (0, games_1.getLobby)(req.body.lobbyId);
        if (!lobby) {
            res.status(404).json({ error: "Lobby not found" });
        }
        else {
            lobby.chat.push({
                user: user.id,
                message: req.body.message,
                time: Date.now()
            });
            (0, games_1.saveLobby)(lobby);
            res.json({ success: true });
        }
    }
});
// Render lobby page (GET /lobby)
router.get("/", (req, res) => {
    const user = (req.session && req.session.user);
    if (!user) {
        res.redirect("/login");
    }
    else {
        res.render("lobby", { user, roomId: req.query.id || '' });
    }
});
exports.default = router;
