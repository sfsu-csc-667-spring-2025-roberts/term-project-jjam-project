document.addEventListener('DOMContentLoaded', function () {
    // Set lobbyId from URL if present
    const urlParams = new URLSearchParams(window.location.search);
    window.lobbyId = urlParams.get('id');
    
    // Set userId from user data if available
    const userElement = document.querySelector('h1 .gravatar');
    if (userElement) {
        const userIdMatch = userElement.nextSibling.textContent.match(/\(([^)]+)\)/);
        if (userIdMatch && userIdMatch[1]) {
            window.userId = userIdMatch[1].trim();
        }
    }
    
    function showMessage(msg, type) {
        let el = document.getElementById('feedback-message');
        if (!el) {
            el = document.createElement('div');
            el.id = 'feedback-message';
            el.style.margin = '10px 0';
            el.style.padding = '8px';
            el.style.borderRadius = '4px';
            el.style.fontWeight = 'bold';
            document.getElementById('content')?.prepend(el);
        }
        el.textContent = msg;
        el.style.background = type === 'success' ? '#d4ffd4' : '#ffd4d4';
        el.style.color = type === 'success' ? '#075e07' : '#a80000';
    }

    // --- SOCKET.IO INTEGRATION ---
    const socket = window.io ? window.io() : null;
    
    function renderLobbyList(lobbies) {
        const list = document.getElementById('game-listing');
        list.innerHTML = '';
        lobbies.forEach(lobby => {
            const div = document.createElement('div');
            div.innerHTML = `
                <b>${lobby.name}</b> (${lobby.players} players)
                <button data-id="${lobby.id}" data-name="${lobby.name}" class="join-btn">Join</button>
                <button data-id="${lobby.id}" class="leave-btn">Leave</button>
                <button data-id="${lobby.id}" class="copy-link-btn">Copy Invite Link</button>
                <div class="player-list"></div>
            `;
            list.appendChild(div);
            const playerDiv = div.querySelector('.player-list');
            if (lobby.players_list && lobby.players_list.length) {
                lobby.players_list.forEach(player => {
                    const avatar = document.createElement('img');
                    avatar.className = 'player-avatar';
                    avatar.src = `https://gravatar.com/avatar/${player.gravatar || ''}?s=32&d=identicon`;
                    avatar.alt = player.id || player;
                    avatar.title = player.id || player;
                    playerDiv.appendChild(avatar);
                });
            } else {
                playerDiv.textContent = '';
            }
        });
        // Button event handlers (join, leave, copy) as before...
    }

    function renderChat(messages) {
        const messagesDiv = document.getElementById('messages');
        messagesDiv.innerHTML = '';
        messages.forEach(msg => {
            const div = document.createElement('div');
            div.className = 'chat-message' + (msg.userId === window.userId ? ' self' : '');
            div.innerHTML = `
                <img class="avatar" src="https://gravatar.com/avatar/${msg.gravatar || ''}?s=36&d=identicon" alt="avatar" />
                <div class="msg-content">
                    <span class="username">${msg.username || msg.user || 'User'}</span>
                    <span class="timestamp">${msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ''}</span><br/>
                    ${msg.message}
                </div>
            `;
            messagesDiv.appendChild(div);
        });
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    // --- END SOCKET.IO INTEGRATION ---

    function fetchLobbies() {
        fetch('/lobby/list')
            .then(res => res.json())
            .then(lobbies => {
                const list = document.getElementById('game-listing');
                list.innerHTML = '';
                lobbies.forEach(lobby => {
                    const div = document.createElement('div');
                    div.innerHTML = `
                        <b>${lobby.name}</b> (${lobby.players} players)
                        <button data-id="${lobby.id}" data-name="${lobby.name}" class="join-btn">Join</button>
                        <button data-id="${lobby.id}" class="leave-btn">Leave</button>
                        <button data-id="${lobby.id}" class="copy-link-btn">Copy Invite Link</button>
                        <div class="player-list" style="margin-left:20px;font-size:90%"></div>
                    `;
                    list.appendChild(div);
                    const playerDiv = div.querySelector('.player-list');
                    playerDiv.textContent = lobby.players_list ? 'Players: ' + lobby.players_list.join(', ') : '';
                });

                // Join
                document.querySelectorAll('.join-btn').forEach(btn => {
                    btn.onclick = async function () {
                        const gameId = btn.dataset.id;
                        const userId = window.userId || prompt('Enter your User ID:');
                        const password = prompt(`Enter password for "${btn.dataset.name}" (leave blank if none):`);
                        if (!userId) return showMessage('User ID required.', 'error');
                        try {
                            const res = await fetch(`/lobby/join`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ lobbyId: gameId, userId, password })
                            });
                            const data = await res.json();
                            if (data.success) {
                                showMessage(`Joined successfully! Player count: ${data.playerCount}`, 'success');
                                setTimeout(() => location.reload(), 1000);
                            } else {
                                showMessage(data.reason || data.error || 'Could not join game.', 'error');
                            }
                        } catch (err) {
                            showMessage('Network error. Try again.', 'error');
                        }
                    };
                });

                // Leave
                document.querySelectorAll('.leave-btn').forEach(btn => {
                    btn.onclick = async function () {
                        const gameId = btn.dataset.id;
                        const userId = window.userId || prompt('Enter your User ID:');
                        if (!userId) return showMessage('User ID required.', 'error');
                        try {
                            const res = await fetch(`/lobby/leave`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ lobbyId: gameId, userId })
                            });
                            const data = await res.json();
                            if (data.success) {
                                showMessage('Left game successfully.', 'success');
                                setTimeout(() => location.reload(), 1000);
                            } else {
                                showMessage(data.reason || data.error || 'Could not leave game.', 'error');
                            }
                        } catch (err) {
                            showMessage('Network error. Try again.', 'error');
                        }
                    };
                });

                // Copy Invite Link
                document.querySelectorAll('.copy-link-btn').forEach(btn => {
                    btn.onclick = function () {
                        const url = `${window.location.origin}/lobby?id=${btn.dataset.id}`;
                        navigator.clipboard.writeText(url).then(() => {
                            showMessage('Invite link copied!', 'success');
                        }, () => {
                            showMessage('Could not copy link.', 'error');
                        });
                    };
                });

                // Client-side lobby search
                const searchInput = document.getElementById('lobby-search-input');
                if (searchInput) {
                    searchInput.oninput = function () {
                        const term = searchInput.value.toLowerCase();
                        document.querySelectorAll('#game-listing > div').forEach(div => {
                            const name = div.querySelector('b')?.textContent.toLowerCase() || '';
                            div.style.display = name.includes(term) ? '' : 'none';
                        });
                    };
                }
            });
    }

    function setupCreateLobby() {
        const createGameForm = document.getElementById('create-game-form');
        if (createGameForm) {
            createGameForm.onsubmit = function (e) {
                e.preventDefault();
                const nameInput = document.getElementById('game-name');
                const name = nameInput.value;
                if (!name) return;
                
                fetch('/lobby/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name })
                }).then(() => location.reload());
            };
        }
    }

    // --- REMOVE POLLING, USE SOCKET.IO EVENTS ---
    // pollChat removed
    

    document.getElementById('chat-container')?.addEventListener('submit', function (e) {
        e.preventDefault();
        const input = document.getElementById('message');
        const message = input.value.trim();
        if (!message) return;
        if (socket && window.lobbyId && window.userId) {
            socket.emit('chatMessage', {
                lobbyId: window.lobbyId,
                userId: window.userId,
                message: message
            });
        }
        input.value = '';
    });

    // Init
    fetchLobbies();
    setupCreateLobby();

    // --- Add AI Opponent Button ---
    const addAIButton = document.getElementById('add-ai-btn');
    if (addAIButton && socket) {
        addAIButton.onclick = function() {
            if (window.lobbyId) {
                socket.emit('addAI', { lobbyId: window.lobbyId });
                showMessage('Adding AI opponent...', 'success');
            }
        };
    }

    // --- SOCKET.IO EVENT HANDLERS ---
    if (socket) {
        // Join lobby room for real-time updates
        if (window.lobbyId && window.userId) {
            socket.emit('joinLobby', { lobbyId: window.lobbyId, userId: window.userId });
        }
        socket.on('lobbyUpdate', lobbies => {
            renderLobbyList(lobbies);
        });
        socket.on('chatMessage', data => {
            if (data.lobbyId === window.lobbyId) {
                renderChat(data.chat);
            }
        });
        socket.on('playerJoined', data => {
            if (data.lobbyId === window.lobbyId) {
                showMessage(`${data.username || 'A user'} joined the lobby.`, 'success');
            }
        });
        socket.on('playerLeft', data => {
            if (data.lobbyId === window.lobbyId) {
                showMessage(`${data.username || 'A user'} left the lobby.`, 'error');
            }
        });
        // Request initial lobby and chat state
        if (window.lobbyId) {
            socket.emit('getLobbyState', { lobbyId: window.lobbyId });
            socket.on('lobbyState', data => {
                if (data.lobbyId === window.lobbyId) {
                    renderLobbyList([data.lobby]);
                    renderChat(data.lobby.chat || []);
                }
            });
        }
    }
});

