import fs from "fs";
import path from "path";

const DB_PATH = path.join(__dirname, "games.json");

export interface Lobby {
    id: string;
    name: string;
    host: string;
    players: string[];
    created: number;
    started: boolean;
    chat: { user: string; message: string; time: number }[];
    gameId?: string;
}

export interface GameState {
    id: string;
    lobbyId: string;
    players: string[];
    hands: { [userId: string]: string[] };
    deck: string[];
    discard: string[];
    currentPlayer: string;
    direction: number;
    winner?: string;
    started: boolean;
    chat: { user: string; message: string; time: number }[];
    lastAction: number;
}

function loadDB(): { lobbies: Lobby[]; games: GameState[] } {
    if (!fs.existsSync(DB_PATH)) {
        fs.writeFileSync(DB_PATH, JSON.stringify({ lobbies: [], games: [] }, null, 2));
    }
    return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}

function saveDB(data: { lobbies: Lobby[]; games: GameState[] }) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export function getLobbies(): Lobby[] {
    return loadDB().lobbies;
}

export function getLobby(id: string): Lobby | undefined {
    return getLobbies().find(l => l.id === id);
}

export function saveLobby(lobby: Lobby) {
    const db = loadDB();
    const idx = db.lobbies.findIndex(l => l.id === lobby.id);
    if (idx >= 0) db.lobbies[idx] = lobby;
    else db.lobbies.push(lobby);
    saveDB(db);
}

export function deleteLobby(id: string) {
    const db = loadDB();
    db.lobbies = db.lobbies.filter(l => l.id !== id);
    saveDB(db);
}

export function getGames(): GameState[] {
    return loadDB().games;
}

export function getGame(id: string): GameState | undefined {
    return getGames().find(g => g.id === id);
}

export function saveGame(game: GameState) {
    const db = loadDB();
    const idx = db.games.findIndex(g => g.id === game.id);
    if (idx >= 0) db.games[idx] = game;
    else db.games.push(game);
    saveDB(db);
}

export function deleteGame(id: string) {
    const db = loadDB();
    db.games = db.games.filter(g => g.id !== id);
    saveDB(db);
}
