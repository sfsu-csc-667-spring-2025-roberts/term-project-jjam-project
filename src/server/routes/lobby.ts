import express, { Request, Response } from "express";
import * as lobbyService from "../services/lobbyService";

const router = express.Router();

// List all lobbies (GET /lobby/list)
router.get("/list", (req: Request, res: Response) => {
  const result = lobbyService.listLobbies();
  if (result.success) {
    res.json({ success: true, lobbies: result.data });
  } else {
    console.error("[lobby:list]", result.error);
    res.status(500).json({ success: false, error: result.error });
  }
});

// Create a lobby (POST /lobby/create)
router.post("/create", (req: Request, res: Response) => {
  const user = (req.session && (req.session as any).user) as { id: string; email: string; gravatar?: string } | undefined;
  const result = lobbyService.createLobby(user, req.body.name);
  if (result.success) {
    res.json({ success: true, lobby: result.data });
  } else {
    console.error("[lobby:create]", result.error);
    res.status(result.error?.code === 'UNAUTHENTICATED' ? 401 : 500).json({ success: false, error: result.error });
  }
});

// Join a lobby (POST /lobby/join)
router.post("/join", (req: Request, res: Response) => {
  const user = (req.session && (req.session as any).user) as { id: string; email: string; gravatar?: string } | undefined;
  const result = lobbyService.joinLobby(user, req.body.lobbyId);
  if (result.success) {
    res.json({ success: true, lobby: result.data, playerCount: result.data?.players.length });
  } else {
    console.error("[lobby:join]", result.error);
    res.status(result.error?.code === 'UNAUTHENTICATED' ? 401 : result.error?.code === 'NOT_FOUND' ? 404 : 500).json({ success: false, error: result.error });
  }
});

// Leave a lobby (POST /lobby/leave)
router.post("/leave", (req: Request, res: Response) => {
  const user = (req.session && (req.session as any).user) as { id: string; email: string; gravatar?: string } | undefined;
  const result = lobbyService.leaveLobby(user, req.body.lobbyId);
  if (result.success) {
    res.json({ success: true });
  } else {
    console.error("[lobby:leave]", result.error);
    res.status(result.error?.code === 'UNAUTHENTICATED' ? 401 : result.error?.code === 'NOT_FOUND' ? 404 : 500).json({ success: false, error: result.error });
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
