// Handles game moves (play card, draw, etc.) and persists state after each move.
import express from "express";
import { Request, Response } from "express";
import { Game } from "../db";

const router = express.Router();

// More realistic Crazy 8s move handler
router.post("/:gameId/move", async (req: Request, res: Response) => {
  const { gameId } = req.params;
  const { move } = req.body;
  let state = await Game.loadState(Number(gameId));

  // Example: move = { playerId, cardPlayed, draw }
  if (move.cardPlayed) {
    // Remove the card from player's hand and add to discard pile
    state.discardPile = state.discardPile || [];
    state.discardPile.push(move.cardPlayed);
    state.players = state.players.map((p: any) =>
      p.id === move.playerId
        ? { ...p, hand: p.hand.filter((card: any) => card !== move.cardPlayed) }
        : p
    );
    state.lastAction = `Player ${move.playerId} played ${move.cardPlayed}`;
  } else if (move.draw) {
    // Add a card to player's hand
    const card = state.deck.pop();
    state.players = state.players.map((p: any) =>
      p.id === move.playerId
        ? { ...p, hand: [...p.hand, card] }
        : p
    );
    state.lastAction = `Player ${move.playerId} drew a card`;
  }
  // TODO: Add turn logic, win condition, etc.

  // Save updated state
  await Game.saveState(Number(gameId), state);
  res.json({ success: true, state });
});

export default router;
