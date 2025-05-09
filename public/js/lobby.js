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

    function pollChat() {
        const lobbyId = window.lobbyId;
        if (!lobbyId) return;
        fetch('/lobby/list')
            .then(res => res.json())
            .then(lobbies => {
                const lobby = lobbies.find(l => l.id === lobbyId);
                if (!lobby) return;
                const messages = document.getElementById('messages');
                messages.innerHTML = '';
                (lobby.chat || []).forEach(msg => {
                    const div = document.createElement('div');
                    div.textContent = `${msg.user}: ${msg.message}`;
                    messages.appendChild(div);
                });
            });
        setTimeout(pollChat, 2000);
    }

    document.getElementById('chat-container')?.addEventListener('submit', function (e) {
        e.preventDefault();
        const input = document.getElementById('message');
        const message = input.value;
        const lobbyId = window.lobbyId;
        fetch('/lobby/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lobbyId, message })
        }).then(() => { input.value = ''; });
    });

    // Init
    fetchLobbies();
    setupCreateLobby();
    pollChat();
});
