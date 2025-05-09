import express, { Request, Response, Router } from "express";
import { getLobbies, getLobby, saveLobby, deleteLobby } from "../db/games";
import crypto from "crypto";

const router = express.Router();

// List all lobbies (GET /lobby/list)
router.get("/list", (req: Request, res: Response) => {
  const lobbies = getLobbies().map(l => ({
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
router.post("/create", (req: Request, res: Response) => {
  const user = (req.session && (req.session as any).user) as
    | { id: string; email: string; gravatar?: string }
    | undefined;
  
  if (!user) {
    res.status(401).json({ error: "Not authenticated" });
  } else {
    const id = crypto.randomUUID();
    const lobby = {
      id,
      name: req.body.name || `Lobby ${id.slice(0, 4)}`,
      host: user.id,
      players: [user.id],
      created: Date.now(),
      started: false,
      chat: []
    };

    saveLobby(lobby);
    res.json({ success: true, lobby });
  }
});

// Join a lobby (POST /lobby/join)
router.post("/join", (req: Request, res: Response) => {
  const user = (req.session && (req.session as any).user) as
    | { id: string; email: string; gravatar?: string }
    | undefined;
  
  if (!user) {
    res.status(401).json({ error: "Not authenticated" });
  } else {
    const lobby = getLobby(req.body.lobbyId);
    
    if (!lobby) {
      res.status(404).json({ error: "Lobby not found" });
    } else {
      if (!lobby.players.includes(user.id)) {
        lobby.players.push(user.id);
        saveLobby(lobby);
      }

      res.json({ success: true, lobby, playerCount: lobby.players.length });
    }
  }
});

// Leave a lobby (POST /lobby/leave)
router.post("/leave", (req: Request, res: Response) => {
  const user = (req.session && (req.session as any).user) as
    | { id: string; email: string; gravatar?: string }
    | undefined;
  
  if (!user) {
    res.status(401).json({ error: "Not authenticated" });
  } else {
    const lobby = getLobby(req.body.lobbyId);
    
    if (!lobby) {
      res.status(404).json({ error: "Lobby not found" });
    } else {
      lobby.players = lobby.players.filter(pid => pid !== user.id);
      
      if (lobby.players.length === 0) {
        deleteLobby(lobby.id);
      } else {
        saveLobby(lobby);
      }

      res.json({ success: true });
    }
  }
});

// Lobby chat (POST /lobby/chat)
router.post("/chat", (req: Request, res: Response) => {
  const user = (req.session && (req.session as any).user) as
    | { id: string; email: string; gravatar?: string }
    | undefined;
  
  if (!user) {
    res.status(401).json({ error: "Not authenticated" });
  } else {
    const lobby = getLobby(req.body.lobbyId);
    
    if (!lobby) {
      res.status(404).json({ error: "Lobby not found" });
    } else {
      lobby.chat.push({
        user: user.id,
        message: req.body.message,
        time: Date.now()
      });

      saveLobby(lobby);
      res.json({ success: true });
    }
  }
});

// Render lobby page (GET /lobby)
router.get("/", (req: Request, res: Response) => {
  const user = (req.session && (req.session as any).user) as
    | { id: string; email: string; gravatar?: string }
    | undefined;
  
  if (!user) {
    res.redirect("/login");
  } else {
    res.render("lobby", { user, roomId: req.query.id || '' });
  }
});

export default router;
