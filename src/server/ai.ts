// ai.ts - Simple AI Opponent for Crazy 8s
import { getLobby, saveLobby } from "./db/games";
import { getGame, saveGame } from "./db/games";
import fetch from "node-fetch";

export function addAIOpponent(lobbyId: string) {
    const aiId = `AI_${lobbyId}`;
    const aiUser = {
        id: aiId,
        email: "crazy8s-ai@bot.com",
        gravatar: "",
        isAI: true,
        username: "AI Opponent",
    };
    const lobby = getLobby(lobbyId);
    if (!lobby) return false;
    if (!lobby.players.includes(aiId)) {
        lobby.players.push(aiId);
        saveLobby(lobby);
    }
    return true;
}

// --- Simple Random-Move AI ---
export async function aiMaybePlayTurn(gameId: string) {
    const state = getGame(gameId);
    if (!state) return;
    const aiId = state.players.find((pid: string) => pid.startsWith("AI_"));
    if (!aiId) return;
    if (state.currentPlayer !== aiId || state.winner) return;
    // Find all valid moves
    const hand = state.hands[aiId] || [];
    const top = state.discard && state.discard.length > 0 ? state.discard[state.discard.length - 1] : null;
    function parseCard(card: string) {
        return { rank: card.slice(0, -1), suit: card.slice(-1) };
    }
    const topCard = top ? parseCard(top) : null;
    const valid = hand.filter((c: string) => {
        const parsed = parseCard(c);
        return (
            parsed.rank === "8" ||
            (topCard && (parsed.suit === topCard.suit || parsed.rank === topCard.rank))
        );
    });
    // Randomly decide to play or draw (50/50)
    let move;
    if (valid.length && Math.random() < 0.5) {
        const cardPlayed = valid[Math.floor(Math.random() * valid.length)];
        move = { playerId: aiId, cardPlayed };
    } else {
        move = { playerId: aiId, draw: true };
    }
    // Call moves endpoint directly (simulate as if AI is a client)
    await fetch(`http://localhost:3000/moves/${gameId}/move`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ move }),
    });
}
