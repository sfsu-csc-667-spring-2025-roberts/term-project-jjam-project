// Handles game moves (play card, draw, etc.) and persists state after each move.
import express from "express";
import { Request, Response } from "express";
import { getGame, saveGame } from "../db/games";
import { aiMaybePlayTurn } from "../ai";

const router = express.Router();

// More realistic Crazy 8s move handler
router.post("/:gameId/move", async (req: Request, res: Response): Promise<void> => {
  const { gameId } = req.params;
  const { move } = req.body;
  let state = getGame(String(gameId));
  if (!state) {
    res.status(404).json({ error: 'Game not found' });
    return;
  }
  // Example: move = { playerId, cardPlayed, draw }
  const playerId = String(move.playerId);
  if (!Array.isArray(state.hands[playerId])) {
    state.hands[playerId] = [];
  }

  // Only current player can act
  if (state.currentPlayer !== playerId) {
    res.status(403).json({ error: 'Not your turn', state });
    return;
  }

  // Helper to parse card as {rank, suit}
  function parseCard(card: string) {
    // Example: "8H" => { rank: "8", suit: "H" }
    return { rank: card.slice(0, -1), suit: card.slice(-1) };
  }

  // Validate and process move
  let validMove = false;
  if (move.cardPlayed) {
    const card = move.cardPlayed;
    const hand = state.hands[playerId];
    if (!hand.includes(card)) {
      res.status(400).json({ error: 'Card not in hand', state });
      return;
    }
    const top = state.discard && state.discard.length > 0 ? state.discard[state.discard.length - 1] : null;
    const played = parseCard(card);
    const topCard = top ? parseCard(top) : null;
    // Card must match rank, suit, or be an eight
    if (
      !topCard ||
      played.rank === '8' ||
      (topCard && (played.suit === topCard.suit || played.rank === topCard.rank))
    ) {
      validMove = true;
      state.discard = state.discard || [];
      state.discard.push(card);
      state.hands[playerId] = hand.filter((c: any) => c !== card);
      state.lastAction = `Player ${playerId} played ${card}`;
    }
  } else if (move.draw) {
    if (!Array.isArray(state.deck)) state.deck = [];
    if (state.deck.length > 0) {
      const card = state.deck.pop();
      if (card) state.hands[playerId].push(card);
      state.lastAction = `Player ${playerId} drew a card`;
      validMove = true;
    }
  }

  if (!validMove) {
    res.status(400).json({ error: 'Invalid move', state });
    return;
  }

  // Win condition
  if (state.hands[playerId].length === 0) {
    state.winner = playerId;
    state.lastAction = `Player ${playerId} wins!`;
  }

  // Advance turn if game not over
  if (!state.winner) {
    const playerList = state.players;
    let idx = playerList.indexOf(playerId);
    let nextIdx = idx;
    // Find next player with playable cards or deck not empty
    for (let i = 1; i <= playerList.length; i++) {
      const testIdx = (idx + i) % playerList.length;
      const pid = playerList[testIdx];
      const hand = state.hands[pid] || [];
      const top = state.discard && state.discard.length > 0 ? state.discard[state.discard.length - 1] : null;
      const topCard = top ? parseCard(top) : null;
      const canPlay = hand.some((c: string) => {
        const parsed = parseCard(c);
        return (
          parsed.rank === '8' ||
          (topCard && (parsed.suit === topCard.suit || parsed.rank === topCard.rank))
        );
      });
      if (canPlay || (state.deck && state.deck.length > 0)) {
        nextIdx = testIdx;
        break;
      }
    }
    state.currentPlayer = playerList[nextIdx];
  }

  // Save updated state
  saveGame(state);

  // If next player is an AI, trigger AI move
  const nextPlayer = state.currentPlayer;
  if (nextPlayer && typeof nextPlayer === "string" && nextPlayer.startsWith("AI_")) {
    // Fire and forget; do not await
    aiMaybePlayTurn(gameId).catch(() => {});
  }

  res.json({ success: true, state });
});

export default router;
