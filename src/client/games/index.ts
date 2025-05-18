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

const cardMap = {
    1: { value: 'A', suit: 'S', display: 'A♠' },
    2: { value: '2', suit: 'S', display: '2♠' },
    3: { value: '3', suit: 'S', display: '3♠' },
    4: { value: '4', suit: 'S', display: '4♠' },
    5: { value: '5', suit: 'S', display: '5♠' },
    6: { value: '6', suit: 'S', display: '6♠' },
    7: { value: '7', suit: 'S', display: '7♠' },
    8: { value: '8', suit: 'W', display: '8' },
    9: { value: '9', suit: 'S', display: '9♠' },
    10: { value: '10', suit: 'S', display: '10♠' },
    11: { value: 'J', suit: 'S', display: 'J♠' },
    12: { value: 'Q', suit: 'S', display: 'Q♠' },
    13: { value: 'K', suit: 'S', display: 'K♠' },
    14: { value: 'A', suit: 'H', display: 'A♥' },
    15: { value: '2', suit: 'H', display: '2♥' },
    16: { value: '3', suit: 'H', display: '3♥' },
    17: { value: '4', suit: 'H', display: '4♥' },
    18: { value: '5', suit: 'H', display: '5♥' },
    19: { value: '6', suit: 'H', display: '6♥' },
    20: { value: '7', suit: 'H', display: '7♥' },
    21: { value: '8', suit: 'W', display: '8' },
    22: { value: '9', suit: 'H', display: '9♥' },
    23: { value: '10', suit: 'H', display: '10♥' },
    24: { value: 'J', suit: 'H', display: 'J♥' },
    25: { value: 'Q', suit: 'H', display: 'Q♥' },
    26: { value: 'K', suit: 'H', display: 'K♥' },
    27: { value: 'A', suit: 'D', display: 'A♦' },
    28: { value: '2', suit: 'D', display: '2♦' },
    29: { value: '3', suit: 'D', display: '3♦' },
    30: { value: '4', suit: 'D', display: '4♦' },
    31: { value: '5', suit: 'D', display: '5♦' },
    32: { value: '6', suit: 'D', display: '6♦' },
    33: { value: '7', suit: 'D', display: '7♦' },
    34: { value: '8', suit: 'W', display: '8' },
    35: { value: '9', suit: 'D', display: '9♦' },
    36: { value: '10', suit: 'D', display: '10♦' },
    37: { value: 'J', suit: 'D', display: 'J♦' },
    38: { value: 'Q', suit: 'D', display: 'Q♦' },
    39: { value: 'K', suit: 'D', display: 'K♦' },
    40: { value: 'A', suit: 'C', display: 'A♣' },
    41: { value: '2', suit: 'C', display: '2♣' },
    42: { value: '3', suit: 'C', display: '3♣' },
    43: { value: '4', suit: 'C', display: '4♣' },
    44: { value: '5', suit: 'C', display: '5♣' },
    45: { value: '6', suit: 'C', display: '6♣' },
    46: { value: '7', suit: 'C', display: '7♣' },
    47: { value: '8', suit: 'W', display: '8' },
    48: { value: '9', suit: 'C', display: '9♣' },
    49: { value: '10', suit: 'C', display: '10♣' },
    50: { value: 'J', suit: 'C', display: 'J♣' },
    51: { value: 'Q', suit: 'C', display: 'Q♣' },
    52: { value: 'K', suit: 'C', display: 'K♣' },
    53: { value: '8', suit: 'S', display: '8♠' },
    54: { value: '8', suit: 'H', display: '8♥' },
    55: { value: '8', suit: 'D', display: '8♦' },
    56: { value: '8', suit: 'C', display: '8♣' },
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
            playersData.forEach((player: { id: string; email: string; hand_count: number }) => {
                if (player.id !== currentUserId && player.id !== '0' && player.id !== '-1') {
                    const opponentInfo = document.createElement('p');
                    if (player.hand_count != 0) {
                        opponentInfo.textContent = `${player.email}: ${player.hand_count} cards`;
                    } else {
                        opponentInfo.textContent = `${player.email}: WINNER!`;
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
            discardPileDiv.innerHTML = '<h3>Discard Pile</h3>';
            if (discardTopData) {
                //@ts-ignore
                const cardInfo = cardMap[discardTopData.card_id];
                const cardElement = document.createElement('div');
                cardElement.classList.add('card', cardInfo?.suit.toLowerCase());
                cardElement.textContent = cardInfo?.display || `ID: ${discardTopData.card_id}`;
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
                    // if (isEight) {
                    //     console.log("8 on screen!");
                    // }

                    const cardElement = document.createElement('div');
                    cardElement.id = "hand-card-button";
                    cardElement.classList.add('card', cardInfo?.suit.toLowerCase()); //Add suit as a class for styling
                    cardElement.textContent = cardInfo?.display || `ID: ${card.card_id}`;
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
                            //for discarding wild 8 cards
                            //plan:
                            //have user's desired suit read from button input as cardVal
                            //based on that cardVal, generate a suit version of the 8 using /:gameId/:eightValue/generateWildResult
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
                                // Now fetch and send the turn message
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
                            } else if (discardResponse.status === 403) {
                                const message = await discardResponse.text();
                                console.log(`Discard failed: ${message}`);
                            } else {
                                console.error("Error discarding card:", discardResponse.status);
                            }


                        } else {//only triggers if the card being discarded IS NOT an 8
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
                            } else if (discardResponse.status === 403) {
                                const message = await discardResponse.text();
                                console.log(`Discard failed: ${message}`);
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
                fetch(`${gameId}/winner`, {
                    method: "get",
                });
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




startGameButton?.addEventListener("click", event => {
    event.preventDefault();
    const gameId = getGameId();
    console.log(`games/${gameId}/start`);
    fetch(`${gameId}/start`, {
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
})

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