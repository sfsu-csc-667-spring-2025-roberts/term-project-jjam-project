// Client-side logic for game state rehydration and websocket reconnect
window.addEventListener('DOMContentLoaded', () => {
  if (window.GAME_STATE) {
    // Example: Render the game state (replace with your actual rendering logic)
    console.log('Loaded game state:', window.GAME_STATE);
    // TODO: Render board, hands, etc. using window.GAME_STATE
  }

  // --- WebSocket reconnect logic ---
  let socket;
  function connectSocket() {
    socket = io();
    const gameId = window.GAME_STATE && window.GAME_STATE.id;
    if (gameId) {
      socket.emit('rejoin', { gameId });
    }
    socket.on('gameState', (state) => {
      // Update UI with latest state
      console.log('Received latest game state:', state);
      // TODO: Re-render game UI
    });
    socket.on('disconnect', () => {
      setTimeout(connectSocket, 1000); // try to reconnect
    });
  }
  if (typeof io !== 'undefined') connectSocket();
});
