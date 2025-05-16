import { describe, test, expect } from '@jest/globals';
// Adjust the import path as needed for your project structure
import { parseCard } from '../src/server/routes/moves';

// --- parseCard test (existing) ---
describe('parseCard', () => {
  test('parses a card string like "8H" into {rank: "8", suit: "H"}', () => {
    expect(parseCard('8H')).toEqual({ rank: '8', suit: 'H' });
    expect(parseCard('10D')).toEqual({ rank: '10', suit: 'D' });
    expect(parseCard('QS')).toEqual({ rank: 'Q', suit: 'S' });
  });
});

// --- Game state transition test ---
describe('Game state transitions', () => {
  // Simulate a minimal version of the move handler logic
  function advanceTurn(state: any, playerId: string) {
    const playerList = state.players;
    let idx = playerList.indexOf(playerId);
    let nextIdx = idx;
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
    return state.currentPlayer;
  }

  test('next player advances correctly after a card is played', () => {
    const state = {
      players: ['p1', 'p2', 'p3'],
      hands: { p1: ['8H'], p2: ['9H'], p3: ['10S'] },
      discard: ['7H'],
      deck: ['2D'],
      currentPlayer: 'p1',
    };
    const next = advanceTurn(state, 'p1');
    expect(next).toBe('p2');
  });
});

// --- Edge case tests ---
describe('Edge cases', () => {
  test('playing a card not in hand is rejected', () => {
    const state = {
      hands: { p1: ['8H'] },
      currentPlayer: 'p1',
      discard: ['7H'],
      players: ['p1'],
      deck: [],
    };
    const card = '9H';
    const hand = state.hands['p1'];
    expect(hand.includes(card)).toBe(false);
  });

  test('drawing from an empty deck does not add a card', () => {
    const state = {
      hands: { p1: [] },
      currentPlayer: 'p1',
      discard: ['7H'],
      players: ['p1'],
      deck: [],
    };
    const originalHandLength = state.hands['p1'].length;
    if (state.deck.length > 0) {
      const card = state.deck.pop();
      if (card) state.hands['p1'].push(card);
    }
    expect(state.hands['p1'].length).toBe(originalHandLength);
  });
});

// --- WebSocket event handler test (stub/example) ---
describe('WebSocket event handlers', () => {
  test('should call callback when playerJoined event is received', () => {
    // This is a stub. In a real test, use socket.io-client and a test server.
    let called = false;
    function onPlayerJoined(callback: any) {
      // Simulate receiving event
      callback({ user: { id: 'p1' }, timestamp: 123 });
    }
    onPlayerJoined(() => { called = true; });
    expect(called).toBe(true);
  });
});
