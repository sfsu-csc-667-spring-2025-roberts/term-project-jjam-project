import io from "socket.io-client";

const socket = io();

// Send a chat message to a lobby
export function sendChatMessage(lobbyId: string, message: string) {
  socket.emit("chatMessage", { lobbyId, message });
}

// Listen for incoming chat messages
export function onChatMessage(callback: (data: { user: any; message: string; timestamp: number }) => void) {
  socket.on("chatMessage", callback);
}

// --- Player Join/Leave/CardPlayed Helpers ---
export function joinLobby(lobbyId: string) {
  socket.emit("playerJoin", { lobbyId });
}

export function leaveLobby(lobbyId: string) {
  socket.emit("playerLeave", { lobbyId });
}

export function playCard(lobbyId: string, card: string, nextPlayerId?: string) {
  socket.emit("cardPlayed", { lobbyId, card, nextPlayerId });
}

export function onPlayerJoined(callback: (data: { user: any; timestamp: number }) => void) {
  socket.on("playerJoined", callback);
}

export function onPlayerLeft(callback: (data: { user: any; timestamp: number }) => void) {
  socket.on("playerLeft", callback);
}

export function onCardPlayed(callback: (data: { user: any; card: string; nextPlayerId?: string; timestamp: number }) => void) {
  socket.on("cardPlayed", callback);
}

export { socket };