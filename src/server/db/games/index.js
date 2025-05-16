"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLobbies = getLobbies;
exports.getLobby = getLobby;
exports.saveLobby = saveLobby;
exports.deleteLobby = deleteLobby;
exports.getGames = getGames;
exports.getGame = getGame;
exports.saveGame = saveGame;
exports.deleteGame = deleteGame;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const DB_PATH = path_1.default.join(__dirname, "games.json");
function loadDB() {
    if (!fs_1.default.existsSync(DB_PATH)) {
        fs_1.default.writeFileSync(DB_PATH, JSON.stringify({ lobbies: [], games: [] }, null, 2));
    }
    return JSON.parse(fs_1.default.readFileSync(DB_PATH, "utf-8"));
}
function saveDB(data) {
    fs_1.default.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}
function getLobbies() {
    return loadDB().lobbies;
}
function getLobby(id) {
    return getLobbies().find(l => l.id === id);
}
function saveLobby(lobby) {
    const db = loadDB();
    const idx = db.lobbies.findIndex(l => l.id === lobby.id);
    if (idx >= 0)
        db.lobbies[idx] = lobby;
    else
        db.lobbies.push(lobby);
    saveDB(db);
}
function deleteLobby(id) {
    const db = loadDB();
    db.lobbies = db.lobbies.filter(l => l.id !== id);
    saveDB(db);
}
function getGames() {
    return loadDB().games;
}
function getGame(id) {
    return getGames().find(g => g.id === id);
}
function saveGame(game) {
    const db = loadDB();
    const idx = db.games.findIndex(g => g.id === game.id);
    if (idx >= 0)
        db.games[idx] = game;
    else
        db.games.push(game);
    saveDB(db);
}
function deleteGame(id) {
    const db = loadDB();
    db.games = db.games.filter(g => g.id !== id);
    saveDB(db);
}
