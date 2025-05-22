//console.log("Hello from the client (games)");

const startGameButton = document.querySelector("#start-game-button") as HTMLButtonElement | null;
const announcePresenceButton = document.querySelector("#announce-presence-button");
const showHandButton = document.querySelector("#show-hand-button");
const playerHandContainer = document.querySelector('#player-hand-container') as HTMLDivElement | null;
const playerHandDiv = document.querySelector('#player-hand') as HTMLDivElement | null;
const opponentCardCountsDiv = document.querySelector('#opponent-card-counts') as HTMLDivElement | null;
const gameIdDisplay = document.querySelector('#game-id-display');
const gameId = gameIdDisplay ? gameIdDisplay.textContent : null;
const currentUserId = document.body.dataset.userId;
const discardPileDiv = document.querySelector('#discard-pile') as HTMLDivElement | null;
const drawCardButton = document.querySelector("#draw-card-button");
const discardCard = document.querySelector("#hand-card-button");
const resetGameButton = document.querySelector("#reset-game-button");
const resetConfirmInput = document.querySelector("#resetConfirm") as HTMLInputElement | null;
const deleteGameButton = document.querySelector("#delete-game-button");
const deleteConfirmInput = document.querySelector("#deleteConfirm") as HTMLInputElement | null;
const leaveGameButton = document.querySelector("#leave-game-button");
const leaveConfirmInput = document.querySelector("#leaveConfirm") as HTMLInputElement | null;

const cardMap = {
    // Spades (Suit Value 1)
    1: { value: 'A', suit: 'S', display: 'A♠', imageName: '1 (1).png' },
    2: { value: '2', suit: 'S', display: '2♠', imageName: '1 (2).png' },
    3: { value: '3', suit: 'S', display: '3♠', imageName: '1 (3).png' },
    4: { value: '4', suit: 'S', display: '4♠', imageName: '1 (4).png' },
    5: { value: '5', suit: 'S', display: '5♠', imageName: '1 (5).png' },
    6: { value: '6', suit: 'S', display: '6♠', imageName: '1 (6).png' },
    7: { value: '7', suit: 'S', display: '7♠', imageName: '1 (7).png' },
    8: { value: '8', suit: 'W', display: '8', imageName: '1 (8).png' }, // Base 8 of Spades
    9: { value: '9', suit: 'S', display: '9♠', imageName: '1 (9).png' },
    10: { value: '10', suit: 'S', display: '10♠', imageName: '1 (10).png' },
    11: { value: 'J', suit: 'S', display: 'J♠', imageName: '1 (11).png' },
    12: { value: 'Q', suit: 'S', display: 'Q♠', imageName: '1 (12).png' },
    13: { value: 'K', suit: 'S', display: 'K♠', imageName: '1 (13).png' },

    // Hearts (Suit Value 2)
    14: { value: 'A', suit: 'H', display: 'A♥', imageName: '2 (1).png' },
    15: { value: '2', suit: 'H', display: '2♥', imageName: '2 (2).png' },
    16: { value: '3', suit: 'H', display: '3♥', imageName: '2 (3).png' },
    17: { value: '4', suit: 'H', display: '4♥', imageName: '2 (4).png' },
    18: { value: '5', suit: 'H', display: '5♥', imageName: '2 (5).png' },
    19: { value: '6', suit: 'H', display: '6♥', imageName: '2 (6).png' },
    20: { value: '7', suit: 'H', display: '7♥', imageName: '2 (7).png' },
    21: { value: '8', suit: 'W', display: '8', imageName: '2 (8).png' }, // Base 8 of Hearts
    22: { value: '9', suit: 'H', display: '9♥', imageName: '2 (9).png' },
    23: { value: '10', suit: 'H', display: '10♥', imageName: '2 (10).png' },
    24: { value: 'J', suit: 'H', display: 'J♥', imageName: '2 (11).png' },
    25: { value: 'Q', suit: 'H', display: 'Q♥', imageName: '2 (12).png' },
    26: { value: 'K', suit: 'H', display: 'K♥', imageName: '2 (13).png' },

    // Diamonds (Suit Value 3)
    27: { value: 'A', suit: 'D', display: 'A♦', imageName: '3 (1).png' },
    28: { value: '2', suit: 'D', display: '2♦', imageName: '3 (2).png' },
    29: { value: '3', suit: 'D', display: '3♦', imageName: '3 (3).png' },
    30: { value: '4', suit: 'D', display: '4♦', imageName: '3 (4).png' },
    31: { value: '5', suit: 'D', display: '5♦', imageName: '3 (5).png' },
    32: { value: '6', suit: 'D', display: '6♦', imageName: '3 (6).png' },
    33: { value: '7', suit: 'D', display: '7♦', imageName: '3 (7).png' },
    34: { value: '8', suit: 'W', display: '8', imageName: '3 (8).png' }, // Base 8 of Diamonds
    35: { value: '9', suit: 'D', display: '9♦', imageName: '3 (9).png' },
    36: { value: '10', suit: 'D', display: '10♦', imageName: '3 (10).png' },
    37: { value: 'J', suit: 'D', display: 'J♦', imageName: '3 (11).png' },
    38: { value: 'Q', suit: 'D', display: 'Q♦', imageName: '3 (12).png' },
    39: { value: 'K', suit: 'D', display: 'K♦', imageName: '3 (13).png' },

    // Clubs (Suit Value 4)
    40: { value: 'A', suit: 'C', display: 'A♣', imageName: '4 (1).png' },
    41: { value: '2', suit: 'C', display: '2♣', imageName: '4 (2).png' },
    42: { value: '3', suit: 'C', display: '3♣', imageName: '4 (3).png' },
    43: { value: '4', suit: 'C', display: '4♣', imageName: '4 (4).png' },
    44: { value: '5', suit: 'C', display: '5♣', imageName: '4 (5).png' },
    45: { value: '6', suit: 'C', display: '6♣', imageName: '4 (6).png' },
    46: { value: '7', suit: 'C', display: '7♣', imageName: '4 (7).png' },
    47: { value: '8', suit: 'W', display: '8', imageName: '4 (8).png' }, // Base 8 of Clubs
    48: { value: '9', suit: 'C', display: '9♣', imageName: '4 (9).png' },
    49: { value: '10', suit: 'C', display: '10♣', imageName: '4 (10).png' },
    50: { value: 'J', suit: 'C', display: 'J♣', imageName: '4 (11).png' },
    51: { value: 'Q', suit: 'C', display: 'Q♣', imageName: '4 (12).png' },
    52: { value: 'K', suit: 'C', display: 'K♣', imageName: '4 (13).png' },

    // Special Wild 8s (imageName matches card_id)
    53: { value: '8', suit: 'S', display: '8♠', imageName: '53.png' }, // Wild Spade 8
    54: { value: '8', suit: 'H', display: '8♥', imageName: '54.png' }, // Wild Heart 8
    55: { value: '8', suit: 'D', display: '8♦', imageName: '55.png' }, // Wild Diamond 8
    56: { value: '8', suit: 'C', display: '8♣', imageName: '56.png' }, // Wild Club 8
};

function getGameId(): string | number {
    const path = window.location.pathname; //gets the pathname
    if (path.startsWith("/games/")) {
        const pathParts = path.split("/");
        if (pathParts.length > 2 && pathParts[2]) {
            return pathParts[2];
        }
    }
    return 0;
}

function getUserId(): string | null {
    const bodyElement = document.querySelector("body");
    return bodyElement?.dataset.userId || null;
}

async function fetchAndUpdateOpponentCardCounts() {
    if (gameId && opponentCardCountsDiv) {
        try {
            const response = await fetch(`/games/${gameId}/players`);
            if (!response.ok) {
                console.error('Failed to fetch player info:', response.status);
                opponentCardCountsDiv.innerHTML = '<p>Failed to load opponent info.</p>';
                return;
            }
            const playersData = await response.json();
            opponentCardCountsDiv.innerHTML = '<h3>Opponent Card Counts</h3>';
            playersData.forEach(async (player: { id: string; email: string; hand_count: number }) => {
                if (player.id !== currentUserId && player.id !== '0' && player.id !== '-1') {
                    const opponentInfo = document.createElement('p');
                    //check if user is player or waiting for next round
                    const isPlayerPromise = await fetch(`${gameId}/${parseInt(player.id)}/isPlayer`);
                    const isPlayerText = await isPlayerPromise.json();
                    const isPlayer = isPlayerText.ingame;
                    //console.log(`IS PLAYER: ${isPlayer}`)
                    if (isPlayer) {
                        if (player.hand_count != 0) {
                            opponentInfo.textContent = `${player.email}: ${player.hand_count} cards`;
                        } else {
                            opponentInfo.textContent = `${player.email}: WINNER!`;
                        }
                    } else {
                        opponentInfo.textContent = `${player.email}: Spectator`;
                    }

                    opponentCardCountsDiv.appendChild(opponentInfo);
                }
            });
        } catch (error) {
            console.error('Error fetching player info:', error);
            opponentCardCountsDiv.innerHTML = '<p>Failed to load opponent info.</p>';
        }
    }
}

//retrieves the current top card of the discard pile
async function fetchAndUpdateDiscard() {
    if (gameId && discardPileDiv) {
        try {
            //see if card matches top discard
            const response = await fetch(`/games/${gameId}/getDiscardTop`);
            if (!response.ok) {
                console.error('Failed to fetch discard top:', response.status);
                discardPileDiv.textContent = 'Discard pile is empty or failed to load.';
                return;
            }
            const discardTopData = await response.json();
            discardPileDiv.innerHTML = '<h3>Discard Pile</h3>'; // Clear previous content

            if (discardTopData) {
                //@ts-ignore
                const cardInfo = cardMap[discardTopData.card_id];

                const cardElement = document.createElement('div');
                // Apply the container class, similar to player hand
                cardElement.classList.add('card-image-container', cardInfo?.suit.toLowerCase());

                const cardImage = document.createElement('img');
                cardImage.src = `/images/cards/${cardInfo?.imageName}`; // Correct path from web root
                cardImage.alt = cardInfo?.display || `ID: ${discardTopData.card_id}`;
                cardImage.classList.add('card-image'); // Add the image styling class

                cardElement.appendChild(cardImage);
                discardPileDiv.appendChild(cardElement);
            } else {
                const emptyMessage = document.createElement('p');
                emptyMessage.textContent = 'Empty';
                discardPileDiv.appendChild(emptyMessage);
            }
        } catch (error) {
            console.error('Error fetching discard top:', error);
            discardPileDiv.textContent = 'Discard pile is empty or failed to load.';
        }
    }
}

async function fetchAndUpdatePlayerHand() {
    if (gameId && playerHandDiv && playerHandContainer) {
        try {
            const response = await fetch(`/games/${gameId}/hand`);
            if (!response.ok) {
                console.error('Failed to fetch hand:', response.status);
                playerHandDiv.textContent = 'Failed to load hand.';
                playerHandContainer.style.display = 'block';
                return;
            }
            const handData = await response.json();
            playerHandDiv.innerHTML = ''; //Clear previous hand
            if (handData && handData.length > 0) {
                handData.forEach((card: { card_id: number }) => {
                    //@ts-ignore
                    const cardInfo = cardMap[card.card_id];

                    //check if card is an 8 or not
                    const isEight = (card.card_id - 1) % 13 === 7;

                    const cardElement = document.createElement('div');
                    cardElement.id = "hand-card-button";
                    // Apply the new class to the container div
                    cardElement.classList.add('card-image-container', cardInfo?.suit.toLowerCase()); //Add suit as a class for styling

                    const cardImage = document.createElement('img');
                    cardImage.src = `/images/cards/${cardInfo?.imageName}`; // Assuming cardInfo.imageName holds the PNG filename
                    cardImage.alt = cardInfo?.display || `ID: ${card.card_id}`;
                    cardImage.classList.add('card-image'); // Keep a class for the image itself
                    cardElement.appendChild(cardImage);

                    cardElement.addEventListener('click', async () => {
                        console.log(`Clicked card ID: ${card.card_id}`);
                        if (isEight) {
                            const selectedSuit = await displaySuitSelectionPopup();
                            if (!selectedSuit) {
                                console.log("Suit selection cancelled or failed.");
                                return; // Do not proceed with discard if no suit selected
                            }
                            let suitValue = 0;
                            switch (selectedSuit) {
                                case 'spade':
                                    suitValue = 53;
                                    break;
                                case 'heart':
                                    suitValue = 54;
                                    break;
                                case 'diamond':
                                    suitValue = 55;
                                    break;
                                case 'club':
                                    suitValue = 56;
                                    break;
                            }
                            console.log(`Selected suit: ${selectedSuit}, value: ${suitValue}`);
                            await fetch(`${gameId}/${suitValue}/generateWildResult`, {
                                method: "post",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                            });
                            const discardResponse = await fetch(`${gameId}/${card.card_id}/${suitValue}/discard`, {
                                method: "post",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                            });
                            if (discardResponse.ok) {
                                console.log(`Successfully discarded card ID: ${card.card_id} (wild 8).`);
                                cardElement.remove();
                                fetchAndUpdateDiscard();
                                fetchAndUpdateOpponentCardCounts();
                                console.log(`Wild 8 played and turn complete (client-side)!`);
                                setTimeout(async () => {
                                    try {
                                        const currNameResponse = await fetch(`/games/${gameId}/getCurrName`);
                                        if (currNameResponse.ok) {
                                            const currentPlayerName = await currNameResponse.text();
                                            console.log(`Current Player's Turn: ${currentPlayerName}`);
                                            if (currentPlayerName != "deck_user@example.com") {
                                                fetch(`/chat/${gameId}`, {
                                                    method: "post",
                                                    headers: {
                                                        "Content-Type": "application/json",
                                                    },
                                                    body: JSON.stringify({
                                                        message: `It is now ${currentPlayerName}'s turn!`,
                                                        senderId: 0,
                                                    }),
                                                }).catch((error) => {
                                                    console.error("Error sending turn message:", error);
                                                });
                                            }
                                        } else {
                                            console.error("Failed to fetch current player name:", currNameResponse.status);
                                        }
                                    } catch (error) {
                                        console.error("Error fetching current player name:", error);
                                    }
                                }, 450);
                            } else if (discardResponse.status == 403) {
                                const message = await discardResponse.text();
                                console.log(`Discard failed: ${message}`);
                            } else if (discardResponse.status == 500) {
                                alert("Not your turn!");
                            } else {
                                console.error("Error discarding card:", discardResponse.status);
                            }
                        } else { //only triggers if the card being discarded IS NOT an 8
                            const discardResponse = await fetch(`${gameId}/${card.card_id}/${0}/discard`, {
                                method: "post",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                            });
                            if (discardResponse.ok) {
                                console.log(`Successfully discarded card ID: ${card.card_id}`);
                                cardElement.remove();
                                fetchAndUpdateDiscard();
                                fetchAndUpdateOpponentCardCounts();
                                console.log(`Turn Complete!`);
                                setTimeout(async () => {
                                    try {
                                        const currNameResponse = await fetch(`/games/${gameId}/getCurrName`);
                                        if (currNameResponse.ok) {
                                            const currentPlayerName = await currNameResponse.text();
                                            console.log(`Current Player's Turn: ${currentPlayerName}`);
                                            if (currentPlayerName != "deck_user@example.com") {
                                                fetch(`/chat/${gameId}`, {
                                                    method: "post",
                                                    headers: {
                                                        "Content-Type": "application/json",
                                                    },
                                                    body: JSON.stringify({
                                                        message: `It is now ${currentPlayerName}'s turn!`,
                                                        senderId: 0,
                                                    }),
                                                }).catch((error) => {
                                                    console.error("Error sending turn message:", error);
                                                });
                                            }
                                        } else {
                                            console.error("Failed to fetch current player name:", currNameResponse.status);
                                        }
                                    } catch (error) {
                                        console.error("Error fetching current player name:", error);
                                    }
                                }, 450);
                            } else if (discardResponse.status == 403) {
                                const message = await discardResponse.text();
                                console.log(`Discard failed: ${message}`);
                            } else if (discardResponse.status == 500) {
                                alert("Not your turn!");
                            } else {
                                console.error("Error discarding card:", discardResponse.status);
                            }
                        }
                    });
                    playerHandDiv.appendChild(cardElement);
                });
                playerHandContainer.style.display = 'block';
            } else {
                //insert game win state here
                playerHandDiv.textContent = 'Your hand is empty.';
                playerHandContainer.style.display = 'block';

                const userId = getUserId();
                // const isPlayerPromise = await fetch(`${gameId}/${userId}/isPlayer`);
                // const isPlayer = await isPlayerPromise.text();

                // if (isPlayer == "true") {
                //     console.log("Winner found!");
                //     fetch(`${gameId}/winner`, {
                //         method: "get",
                //     });
                // }

                const isPlayerPromise = await fetch(`${gameId}/${userId}/isPlayer`);
                const isPlayerText = await isPlayerPromise.json();
                const isPlayer = isPlayerText.ingame;
                //console.log(`IS PLAYER: ${isPlayer}`)
                if (isPlayer) {
                    console.log("Winner found!");
                    fetch(`${gameId}/winner`, {
                        method: "get",
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching hand:', error);
            playerHandDiv.textContent = 'Failed to load hand.';
            playerHandContainer.style.display = 'block';
        }
    } else {
        console.error('Game ID or hand elements not found.');
    }
}

async function displaySuitSelectionPopup(): Promise<string | null> {
    return new Promise((resolve) => {
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = 'white';
        popup.style.padding = '20px';
        popup.style.border = '1px solid black';
        popup.style.zIndex = '1000';
        popup.style.display = 'flex';
        popup.style.flexDirection = 'column';
        popup.style.gap = '10px';
        popup.style.textAlign = 'center';

        const message = document.createElement('p');
        message.textContent = 'Select a suit for the 8:';
        popup.appendChild(message);

        const suits = ['spade', 'heart', 'diamond', 'club'];
        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.display = 'flex';
        buttonsContainer.style.gap = '10px';

        suits.forEach(suit => {
            const button = document.createElement('button');
            button.textContent = suit.charAt(0).toUpperCase() + suit.slice(1);
            button.addEventListener('click', () => {
                console.log(`Selected suit: ${suit}`); // Added console.log here
                document.body.removeChild(popup);
                resolve(suit);
            });
            buttonsContainer.appendChild(button);
        });
        popup.appendChild(buttonsContainer);

        document.body.appendChild(popup);
    });
}




startGameButton?.addEventListener("click", async event => {
    event.preventDefault();
    const gameId = getGameId();
    console.log(`Attempting to start game: games/${gameId}/start`);

    let startResponseStatus;
    try {
        // Await the response from the game start API
        const startResponse = await fetch(`${gameId}/start`, {
            method: "post",
        });
        startResponseStatus = startResponse.status;

        // Check for specific error codes for game start
        if (startResponseStatus === 413) {
            alert("Not enough players to play!"); // Alert for insufficient players
            console.warn(`Game start failed (413 - Not Enough Players) for gameId: ${gameId}.`);
            return; // Stop execution
        } else if (startResponseStatus === 414) {
            alert("Too many players to play!"); // Alert for too many players
            console.warn(`Game start failed (414 - Too Many Players) for gameId: ${gameId}.`);
            return; // Stop execution
        } else if (!startResponse.ok) {
            // Handle any other non-2xx status codes (e.g., 400, 500, 403 if it still happens and you want to catch it generically)
            console.error(`Failed to start game. Status: ${startResponseStatus}`);
            alert(`Failed to start game. Error: ${startResponseStatus}`); // Generic error alert
            return; // Stop execution for other errors
        }
        console.log(`Game start successful, status: ${startResponseStatus}`);

    } catch (error) {
        console.error("Network error or exception during game start fetch:", error);
        alert("Could not connect to the server to start the game. Please try again."); // Alert for network issues
        return; // Stop execution on network errors
    }

    // Set all in-game users to players
    try {
        const setPlayersResponse = await fetch(`${gameId}/setInGamePlayers`, {
            method: "post",
        });

        // The original logic for setInGamePlayers' 403 is kept as it was not specified to change
        if (setPlayersResponse.status !== 403) {
            console.log("setInGamePlayers successful, status:", setPlayersResponse.status);
        } else {
            console.warn("setInGamePlayers returned 403 (Forbidden).");
            // Handle the 403 case for setInGamePlayers, e.g., show a message
        }
    } catch (error) {
        console.error("Error setting in-game players:", error);
        // Handle network errors or other issues with the fetch call
    }

    // Send a chat message that the game has started
    fetch(`/chat/${gameId}`, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message: "The game has started! Host plays first!",
            senderId: 0, // ID 0 is the system
        }),
    }).catch((error) => {
        console.error("Error sending game started message:", error);
    });

    // Make the start button disappear
    if (startGameButton) {
        startGameButton.style.display = 'none';
    }
});

drawCardButton?.addEventListener("click", event => {
    event.preventDefault();
    const gameId = getGameId();
    fetch(`${gameId}/draw`, {
        method: "post",
    })
        .then(response => {
            if (response.ok) {
                console.log("Card drawn successfully. Updating UI.");
                fetchAndUpdatePlayerHand();
                fetchAndUpdateOpponentCardCounts();
                fetchAndUpdateDiscard();
            } else if (response.status === 403) {
                response.text().then(message => {
                    console.log(`Draw failed: ${message}`);
                });
            } else if (response.status == 500) {
                alert("Not your turn!");
            } else {
                console.error("Failed to draw card:", response.status);
            }
        })
        .catch((error) => {
            console.error("Could not draw card:", error);
        });
});

//test retrieve user and game id
announcePresenceButton?.addEventListener("click", event => {
    event.preventDefault();
    const gameId = getGameId();
    const userId = getUserId();

    if (userId) {
        fetch(`/chat/${gameId}`, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: `I am player #${userId} in game room #${gameId}`,
                senderId: userId,
            }),
        }).catch((error) => {
            console.error("Error sending announcement message:", error);
        });
    } else {
        console.error("Could not retrieve user ID from the body element.");
    }
});

showHandButton?.addEventListener('click', async (event) => {
    event.preventDefault();
    await fetchAndUpdatePlayerHand();
    await fetchAndUpdateOpponentCardCounts();
    await fetchAndUpdateDiscard();
});

deleteGameButton?.addEventListener('click', async (event) => {
    event.preventDefault();
    const gameId = getGameId();

    const confirmation = confirm("Are you sure you want to delete this game?");

    if (confirmation) {
        // Player confirmed, proceed with deletion
        try {
            const response = await fetch(`${gameId}/deleteGame`, {
                method: "POST",
            });

            if (response.ok) {
                // Game deleted successfully, redirect to the lobby
                console.log("Game deleted successfully");
                window.location.href = "/lobby";
            } else {
                // Handle potential errors during deletion
                console.error("Error deleting game:", response.status);
                alert("Failed to delete the game. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting game:", error);
            alert("An unexpected error occurred while deleting the game.");
        }
    } else {
        // Player cancelled, reset the input field if it exists
        if (deleteConfirmInput) {
            deleteConfirmInput.value = "";
        }
        console.log("Game deletion cancelled.");
    }
});

resetGameButton?.addEventListener('click', async (event) => {
    event.preventDefault();
    const gameId = getGameId();
    // Check if the input value is "reset" (case-insensitive)
    if (resetConfirmInput && resetConfirmInput.value.toLowerCase() === "reset") {

        //reset deck
        fetch(`${gameId}/resetGame`, {
            method: "get",
        });


        // Send a chat message that the deck has been reset
        fetch(`/chat/${gameId}`, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: "Deck reset!",
                senderId: 0, //ID 0 is the system
            }),
        }).catch((error) => {
            console.error("Error sending game deck reset message:", error);
        });

        //start new game
        console.log(`games/${gameId}/start`);
        fetch(`${gameId}/start`, {
            method: "post",
        });

        //set all in game users to players
        fetch(`${gameId}/setInGamePlayers`, {
            method: "post",
        });

        // Send a chat message that the game has started
        fetch(`/chat/${gameId}`, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: "The game has started!",
                senderId: 0, //ID 0 is the system
            }),
        }).catch((error) => {
            console.error("Error sending game started message:", error);
        });

        // Make the start button disappear
        if (startGameButton) {
            startGameButton.style.display = 'none';
        }
        if (resetConfirmInput) {
            resetConfirmInput.value = "";
        }
    } else {
        alert("Please type 'reset' to confirm game reset."); //added an alert
    }
});

leaveGameButton?.addEventListener('click', async (event) => {
    event.preventDefault();
    const gameId = getGameId();
    const userId = getUserId();

    const confirmation = confirm("Are you sure you want to leave this game?");

    if (confirmation) {
        // Player confirmed, proceed with deletion
        try {
            const response = await fetch(`${gameId}/${userId}/leaveGame`, {
                method: "POST",
            });

            if (response.ok) {
                //Left game successfully, redirect to the lobby
                console.log("Exited successfully");
                fetch(`/chat/${gameId}`, {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        message: `Player #${userId} has left the game. Discarding his hand to discard pile`,
                        senderId: 0,
                    }),
                }).catch((error) => {
                    console.error("Error sending announcement message:", error);
                });
                const currNameResponse = await fetch(`/games/${gameId}/getCurrName`);
                if (currNameResponse.ok) {
                    const currentPlayerName = await currNameResponse.text();
                    console.log(`Current Player's Turn: ${currentPlayerName}`);
                    fetch(`/chat/${gameId}`, {
                        method: "post",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            message: `It is now ${currentPlayerName}'s turn!`,
                            senderId: 0,
                        })
                    });
                }
                window.location.href = "/lobby";
            } else {
                // Handle potential errors during deletion
                console.error("Error leaving game:", response.status);
                alert("Failed to leave the game. Please try again.");
            }
        } catch (error) {
            console.error("Error leave game:", error);
            alert("An unexpected error occurred while leaving the game.");
        }
    } else {
        // Player cancelled, reset the input field if it exists
        if (leaveConfirmInput) {
            leaveConfirmInput.value = "";
        }
        console.log("Game cancelled.");
    }
});



//Fetch and update opponent card counts, player hand, and discard every 10 seconds
setInterval(async () => {
    try {
        const response = await fetch(`/games/${gameId}/doesGameExist`);

        if (response.status === 404) {
            //Explicitly check for 404 Not Found: Game deleted on server
            console.log("Game not found (404). Redirecting to lobby.");
            window.location.href = "/lobby";
            return;
        }

        if (!response.ok) {
            console.error(`Error checking game existence: ${response.status}`);
            return;
        }

        //If the game exists (200 OK and data.exists is true), continue updates
        await fetchAndUpdateOpponentCardCounts();
        await fetchAndUpdatePlayerHand();
        await fetchAndUpdateDiscard();
    } catch (error) {
        console.error("Network error checking game existence:", error);
    }
}, 5000);

//Initial fetch of opponent card counts and discard pile
fetchAndUpdateOpponentCardCounts();
fetchAndUpdateDiscard();