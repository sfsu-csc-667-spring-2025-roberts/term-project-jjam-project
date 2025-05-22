// This file provides TypeScript-compatible versions of the lobby-related functions
// that are exported from the JavaScript version of the games module.

import fs from "fs";
import path from "path";

const DB_PATH = path.join(__dirname, "games.json");

function loadDB() {
    if (!fs.existsSync(DB_PATH)) {
        fs.writeFileSync(DB_PATH, JSON.stringify({ lobbies: [], games: [] }, null, 2));
    }
    return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}

function saveDB(data: any) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export function getLobbies() {
    return loadDB().lobbies;
}

export function getLobby(id: string) {
    return getLobbies().find((l: any) => l.id === id);
}

export function saveLobby(lobby: any) {
    const db = loadDB();
    const idx = db.lobbies.findIndex((l: any) => l.id === lobby.id);
    if (idx >= 0)
        db.lobbies[idx] = lobby;
    else
        db.lobbies.push(lobby);
    saveDB(db);
}

export function deleteLobby(id: string) {
    const db = loadDB();
    db.lobbies = db.lobbies.filter((l: any) => l.id !== id);
    saveDB(db);
}

export function getGames() {
    return loadDB().games;
}

export function getGame(id: string) {
    return getGames().find((g: any) => g.id === id);
}

export function saveGame(game: any) {
    const db = loadDB();
    const idx = db.games.findIndex((g: any) => g.id === game.id);
    if (idx >= 0)
        db.games[idx] = game;
    else
        db.games.push(game);
    saveDB(db);
}

export function deleteGame(id: string) {
    const db = loadDB();
    db.games = db.games.filter((g: any) => g.id !== id);
    saveDB(db);
}
