// crazy8s.js - Dynamic client logic for Crazy 8s
// Cascade AI: Initial scaffolding for dynamic rendering and interactivity

// --- Crazy 8s Dynamic Client Logic ---
// Cascade AI: Now fetches/saves state from backend API

// --- Chat Integration ---
async function fetchChat() {
  try {
    const res = await fetch(`/chat/${gameId}`);
    if (!res.ok) throw new Error('Failed to fetch chat');
    const data = await res.json();
    gameState.chat = data.chat || [];
    renderChat();
  } catch (e) {
    gameState.chat = [];
    renderChat();
  }
}

async function sendChatMessage(msg) {
  if (!msg) return;
  try {
    await fetch(`/chat/${gameId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg })
    });
  } catch (e) {
    alert('Failed to send chat message: ' + e.message);
  }
}

function renderChat() {
  const chatDiv = document.getElementById('chat-messages');
  if (!chatDiv) return;
  chatDiv.innerHTML = '';
  (gameState.chat || []).forEach(msg => {
    const el = document.createElement('div');
    el.textContent = `[${new Date(msg.time).toLocaleTimeString()}] ${msg.user}: ${msg.message}`;
    chatDiv.appendChild(el);
  });
  chatDiv.scrollTop = chatDiv.scrollHeight;
}

function setupChatUI() {
  let chatBox = document.getElementById('chat-box');
  if (!chatBox) {
    chatBox = document.createElement('div');
    chatBox.id = 'chat-box';
    chatBox.innerHTML = `
      <div id="chat-messages" style="height:150px;overflow-y:auto;border:1px solid #ccc;margin-bottom:5px;padding:3px;"></div>
      <input id="chat-input" type="text" placeholder="Type a message..." style="width:80%" />
      <button id="chat-send">Send</button>
    `;
    document.body.appendChild(chatBox);
  }
  document.getElementById('chat-send').onclick = () => {
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    if (msg) sendChatMessage(msg);
    input.value = '';
  };
  document.getElementById('chat-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      document.getElementById('chat-send').click();
    }
  });
  renderChat();
}

// --- Real-Time Multiplayer Support ---
let socket;
function setupSocket(gameId) {
  if (typeof io === 'undefined') return; // Socket.io not loaded
  socket = io();
  socket.emit('joinGame', gameId);
  socket.on('gameStateUpdate', (state) => {
    gameState = state;
    renderAll();
  });
  socket.on('chatMessage', (msg) => {
    if (Array.isArray(gameState.chat)) {
      gameState.chat.push(msg);
    } else {
      gameState.chat = [msg];
    }
    renderChat();
  });
}

// Utility: get gameId from URL (expects /games/{id} or ?gameId=)
function getGameId() {
  const match = window.location.pathname.match(/games\/(\d+)/);
  if (match) return match[1];
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('gameId') || '1'; // fallback demo
}
const gameId = getGameId();

// Local game state
let gameState = null;

async function fetchGameState() {
  try {
    showLoading(true);
    const res = await fetch(`/api/games/${gameId}/state`);
    if (!res.ok) throw new Error('Failed to load game state');
    gameState = await res.json();
    await fetchChat();
    renderAll();
    setupSocket(gameId);
  } catch (e) {
    alert('Could not load game state: ' + e.message);
  } finally {
    showLoading(false);
  }
}

async function saveGameState() {
  try {
    const res = await fetch(`/api/games/${gameId}/state`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(gameState)
    });
    if (!res.ok) throw new Error('Failed to save game state');
    // Emit real-time update
    if (socket) {
      socket.emit('gameStateUpdate', { gameId, state: gameState });
    }
  } catch (e) {
    alert('Could not save game state: ' + e.message);
  }
}

function showLoading(show) {
  let el = document.getElementById('loading-indicator');
  if (!el) {
    el = document.createElement('div');
    el.id = 'loading-indicator';
    el.style.position = 'fixed';
    el.style.top = '10px';
    el.style.right = '10px';
    el.style.background = '#222';
    el.style.color = '#fff';
    el.style.padding = '8px 18px';
    el.style.borderRadius = '8px';
    el.style.zIndex = '9999';
    el.textContent = 'Loading...';
    document.body.appendChild(el);
  }
  el.style.display = show ? 'block' : 'none';
}

function renderAll() {
  renderGame();
  setupChatUI();
  renderHand();
  renderChat();
}

function renderGame() {
  // TO DO: implement renderGame function
}

function renderPlayers() {
  const playerList = document.getElementById('player-list');
  playerList.innerHTML = '';
  gameState.players.forEach(p => {
    const li = document.createElement('li');
    li.className = 'player-entry' + (p.isSelf ? ' active' : '');
    li.innerHTML = `<img src="${p.avatar}" alt="Avatar" class="avatar"> ${p.name} <span class="cards-left">${p.cards} cards</span>` + (p.isTurn ? ' <span class="turn-indicator">&larr; Your turn</span>' : '');
    playerList.appendChild(li);
  });
}

function renderHand() {
  const hand = document.getElementById('player-hand');
  hand.innerHTML = '';
  gameState.hand.forEach(card => {
    const div = document.createElement('div');
    div.className = `card suit-${card.suit}`;
    div.tabIndex = 0;
    div.setAttribute('aria-label', `${cardValueToName(card.value)} of ${capitalize(card.suit)}`);
    div.textContent = card.value + suitToSymbol(card.suit);
    hand.appendChild(div);
  });
}

function renderChat() {
  const chat = document.getElementById('chat-messages');
  chat.innerHTML = '';
  gameState.chat.forEach(msg => {
    const div = document.createElement('div');
    div.className = 'chat-message' + (msg.self ? ' self' : '');
    div.innerHTML = `<span class="chat-avatar"><img src="${msg.avatar}" alt="Avatar"></span><span class="chat-user">${msg.user}:</span> ${msg.message}`;
    chat.appendChild(div);
  });
}

function cardValueToName(val) {
  switch(val) {
    case 'A': return 'Ace';
    case 'K': return 'King';
    case 'Q': return 'Queen';
    case 'J': return 'Jack';
    default: return val;
  }
}
function capitalize(str) { return str.charAt(0).toUpperCase() + str.slice(1); }
function suitToSymbol(suit) {
  return { hearts: '♥', diamonds: '♦', clubs: '♣', spades: '♠' }[suit] || '';
}

// Event listeners for actions
function setupActions() {
  document.getElementById('play-card-btn').onclick = () => alert('Play Card clicked!');
  document.getElementById('draw-card-btn').onclick = onDrawCard;
  document.getElementById('pass-btn').onclick = onPass;
}

// Play card event
async function onPlayCard(cardIdx) {
  // Example logic: remove card from hand and add to discard
  const userId = gameState.currentPlayer;
  const card = gameState.hand[cardIdx];
  gameState.hand.splice(cardIdx, 1);
  gameState.discard.push(card);
  // Advance turn (simple round-robin for demo)
  const idx = gameState.players.indexOf(userId);
  gameState.currentPlayer = gameState.players[(idx + 1) % gameState.players.length];
  await saveGameState();
  renderAll();
}

// Draw card event
async function onDrawCard() {
  const userId = gameState.currentPlayer;
  if (gameState.deck.length > 0) {
    const card = gameState.deck.pop();
    gameState.hand.push(card);
  }
  // Advance turn
  const idx = gameState.players.indexOf(userId);
  gameState.currentPlayer = gameState.players[(idx + 1) % gameState.players.length];
  await saveGameState();
  renderAll();
}

// Pass event
async function onPass() {
  // Just advance turn
  const userId = gameState.currentPlayer;
  const idx = gameState.players.indexOf(userId);
  gameState.currentPlayer = gameState.players[(idx + 1) % gameState.players.length];
  await saveGameState();
  renderAll();
}

// Chat send event
function setupChat() {
  const chatForm = document.querySelector('.chat-input');
  const chatInput = document.getElementById('chat-message-input');
  chatForm.onsubmit = () => {
    if(chatInput.value.trim()) {
      gameState.chat.push({ user: 'You', message: chatInput.value, avatar: 'https://gravatar.com/avatar/1?s=20&d=identicon', self: true });
      renderChat();
      chatInput.value = '';
    }
    return false;
  };
}

document.addEventListener('DOMContentLoaded', () => {
  renderPlayers();
  renderHand();
  renderChat();
  setupActions();
  setupChat();
});
