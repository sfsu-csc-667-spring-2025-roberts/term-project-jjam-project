import express from "express";
import { Request, Response } from "express";

import { Game } from "../db";

const router = express.Router();

router.post("/create", async (request: Request, response: Response) => {
    // @ts-ignore
    const { id: userId } = request.session.user;
    const { description, minPlayers, maxPlayers, password } = request.body;

    try {
        const gameId = await Game.create(description, minPlayers, maxPlayers, password, userId);

        response.redirect(`/games/${gameId}`);
    } catch (error) {
        console.log({ error });
        response.redirect("/lobby");
    }
});

router.post("/join/:gameId", async (request: Request, response: Response) => {
    const { gameId } = request.params;
    const { password } = request.body;
    //@ts-ignore
    const { id: userId } = request.session.user;

    try {
        const playerCount = await Game.join(userId, parseInt(gameId), password);
        console.log({ playerCount });
        response.redirect(`/games/${gameId}`);
    } catch (error) {
        console.log({ error });
        console.log("*****************************************************************");
        response.status(403);
    }
});

router.get("/:gameId", async (request: Request, response: Response) => {
    const { gameId: paramsGameId } = request.params;
    const gameId = parseInt(paramsGameId);

    //@ts-ignore
    const { id: userId } = request.session.user;
    const hostId = await Game.getHost(gameId);
    //@ts-ignore
    const user = request.session.user; // Access the user object from the session

    console.log({ hostId, userId, gameId, user });

    response.render("games", { gameId, isHost: hostId === userId, user });
});


router.post("/:gameId/start", async (request: Request, response: Response) => {
    const { gameId: paramsGameId } = request.params;
    const gameId = parseInt(paramsGameId);

    //@ts-ignore
    const { id: userId } = request.session.user;
    const hostId = await Game.getHost(gameId);

    console.log({ gameId, userId, hostId });

    //validation
    //ensure host is starting
    if (hostId !== userId) {
        response.status(200).send();
        return;
    }
    //ensure there are minimum number of players
    const gameInfo = await Game.getInfo(gameId);
    //console.log({gameInfo});


    if (gameInfo.min_players > gameInfo.player_count) {
        console.log("Not enough players to play!");
        response.status(413).send();
        return;
    }

    if (gameInfo.max_players < gameInfo.player_count) {
        console.log("Too many players to play!");
        response.status(414).send();
        return;
    }
    await Game.start(gameId);

    //add cards to game
    //deal cards
    //set current player
    //let players know the game has started

    const gameState = await Game.getState(gameId);
    console.log({ gameState });


    response.status(200).send();
});

//moves selected card from player's hand to player -1 (discard pile)
router.post("/:gameId/:cardId/:isEightVal/discard", async (request: Request, response: Response) => {
    const { gameId: paramsGameId } = request.params;
    const gameId = parseInt(paramsGameId);

    //card that player wants to discard
    const { cardId: paramsCardId } = request.params;
    const cardId = parseInt(paramsCardId);

    const { isEightVal: paramsIsEightVal } = request.params;
    const isEightVal = parseInt(paramsIsEightVal);

    console.log(`value of eightval: ${isEightVal}`);

    //check if it is this player's turn
    //@ts-ignore
    const { id: userId } = request.session.user;
    console.log(`User who is discarding: ${userId}`);

    const turnIdPromise = Game.whoTurn(gameId); //Store the Promise
    const turnIdInt = await turnIdPromise; //convert promise to int
    console.log(`Comparing users ${userId} to ${turnIdInt}`);

    if (userId != await turnIdInt) {
        alert("Not your turn!");
        console.log("Not your turn!");
        response.status(403).send("Not your turn!");
    } else {
        //check if player's selected card matches the discard card number or suit
        const discardIdPromise = Game.getDiscardTop(gameId);
        const discardIdObject = await discardIdPromise;
        const discardId = discardIdObject.card_id;
        console.log(`Comparing cards ${cardId} and ${discardId}`);

        // Calculate ranks
        const cardRank = (cardId - 1) % 13;
        const discardRank = (discardId - 1) % 13;

        // Check for same suit (same chunk of 13) unless it is an 8
        let sameSuit = false;
        let sameRank = false;

        //check if the top of the discard pile matches the suit of the player's chosen card
        if (discardId <= 52 && cardId % 13 !== 8) {
            //if the card is not an 8, check if in the same suit normally
            // Check for same rank
            sameRank = cardRank === discardRank;
            console.log("neither the top discard card nor the card being discarded is an 8");
            sameSuit = Math.floor((cardId - 1) / 13) === Math.floor((discardId - 1) / 13);
        } else {
            //if the top of the discard pile is a suited 8, check suit but special
            console.log("top of discard deck is an 8");
            if ((discardId == 53 && cardId >= 1 && cardId <= 13) ||//spade
                (discardId == 54 && cardId >= 14 && cardId <= 26) ||//heart
                (discardId == 55 && cardId >= 27 && cardId <= 39) ||//diamond
                (discardId == 56 && cardId >= 40 && cardId <= 52)) {//club
                console.log("card is of the same suit as the resulting 8");
                sameSuit = true;
            }
        }

        if ((sameSuit || sameRank) && isEightVal == 0) {
            console.log(`Card being discarded`);

            //move topdiscard card to pile 2
            await Game.moveDiscard(gameId);

            console.log(`Discard pile clear!`);
            //add player's selected card to discard
            const fromUserId = userId;
            console.log(`Discarding ${gameId}, ${cardId}, ${fromUserId}`);
            await Game.discardSelectedCard(gameId, cardId);
            console.log(`Discard successful! ${cardId}`);

            //response.status(200).send(`Discard successful! ${cardId}`);

            //set up next player's turn

            //see if we are at the seat with the highest value
            const highestSeatPromise = await Game.getHighestSeat(gameId);
            const highestSeatInt = highestSeatPromise.highest_seat;
            console.log(highestSeatInt);

            //get current player's seat number
            const currSeatPromise = await Game.getSeat(gameId, turnIdInt);
            const currSeatVal = currSeatPromise.curr_seat;

            console.log(`comparing ${currSeatVal} and ${highestSeatInt}`);
            if (currSeatVal == highestSeatInt) {
                //if we are at top seat in game turn order
                console.log("reset turn order!");
                const lowestSeatPromise = await Game.getLowestSeat(gameId);
                const lowestSeatInt = lowestSeatPromise.lowest_seat;
                console.log(lowestSeatInt);
                Game.isCurrentFlip(gameId, currSeatVal);//set is_current from true to false on current player
                Game.isCurrentFlip(gameId, lowestSeatInt);//set is_current from false to true on player with lowest seat number this game
                response.status(200).send("Turn complete!");
            } else {
                console.log("TURN OVER");
                //console.log(currSeatVal+1);
                Game.isCurrentFlip(gameId, currSeatVal);//set is_current from true to false on current player

                //add code that checks if next seat is valid (player may have left)

                let nextSeatValPromise = await Game.getNextSeat(gameId, currSeatVal);
                console.log(`next player seat: ${nextSeatValPromise.next_seat}`);


                // let playerCount = await Game.getPlayerCount(gameId);
                // console.log(`PLAYER COUNT: ${playerCount}`);
                // let tempPlayerFound = false;
                // let tempNextSeat = 1;

                // if(playerCount > 1) {
                //     while (!tempPlayerFound){
                //         console.log(`temp: ${tempNextSeat}`);

                //         ++tempNextSeat;
                //     }
                // }


                Game.isCurrentFlip(gameId, nextSeatValPromise.next_seat);//set is_current from false to true on next player
                response.status(200).send("Turn complete!");
            }

        } else if (isEightVal != 0) {
            console.log("Card is an 8! Handling wild card logic.");
            //if the player plays an 8, the first thing that happens after choosing a suit is that the wild 8 is discarded
            //then, the newly created suited 8 will immediately be discarded as well
            //ONLY THEN will the next player get their turn
            //response.status(200).send("Card is an 8! Wild card played.");
            console.log(`Card being discarded`);

            //move topdiscard card to pile 2
            await Game.moveDiscard(gameId);
            console.log(`Discard pile clear!`);

            //add wild card to discard
            const fromUserId = userId;
            console.log(`Discarding ${gameId}, ${cardId}, ${fromUserId}`);
            await Game.discardSelectedCard(gameId, cardId);
            console.log(`Discard successful! ${cardId}`);

            //response.status(200).send(`Wild 8 discard successful! ${cardId}`);
            console.log(`Wild 8 discard successful! ${cardId}`);

            //clear discard pile again for suited 8
            await Game.moveDiscard(gameId);
            console.log(`Discard pile clear!`);

            //add suited 8 to discard
            console.log(`Discarding ${gameId}, ${cardId}, ${fromUserId}`);
            await Game.discardSelectedCard(gameId, isEightVal);
            console.log(`Discard successful! ${isEightVal}`);

            //set up next player's turn

            //see if we are at the seat with the highest value
            const highestSeatPromise = await Game.getHighestSeat(gameId);
            const highestSeatInt = highestSeatPromise.highest_seat;
            console.log(highestSeatInt);

            //get current player's seat number
            const currSeatPromise = await Game.getSeat(gameId, turnIdInt);
            const currSeatVal = currSeatPromise.curr_seat;

            console.log(`comparing ${currSeatVal} and ${highestSeatInt}`);
            if (currSeatVal == highestSeatInt) {
                //if we are at top seat in game turn order
                console.log("reset turn order!");
                const lowestSeatPromise = await Game.getLowestSeat(gameId);
                const lowestSeatInt = lowestSeatPromise.lowest_seat;
                console.log(lowestSeatInt);
                Game.isCurrentFlip(gameId, currSeatVal);//set is_current from true to false on current player
                Game.isCurrentFlip(gameId, lowestSeatInt);//set is_current from false to true on player with lowest seat number this game
                response.status(200).send("Turn complete!");
            } else {
                console.log("TURN OVER");
                //console.log(currSeatVal+1);
                Game.isCurrentFlip(gameId, currSeatVal);//set is_current from true to false on current player

                //check next available seat
                let nextSeatValPromise = await Game.getNextSeat(gameId, currSeatVal);

                Game.isCurrentFlip(gameId, nextSeatValPromise.next_seat);//set is_current from false to true on next player
                response.status(200).send("Turn complete!");
            }

        } else {
            console.log("Card doesn't match!");
            response.status(403).send("Card doesn't match!");
        }
    }
});

//draw a card
router.post("/:gameId/draw", async (request: Request, response: Response) => {
    const { gameId: paramsGameId } = request.params;
    const gameId = parseInt(paramsGameId);

    //check if it is this player's turn
    //@ts-ignore
    const { id: userId } = request.session.user;
    console.log(`User who is drawing: ${userId}`);

    const turnIdPromise = Game.whoTurn(gameId); //Store the Promise
    const turnIdInt = await turnIdPromise; //convert promise to int
    console.log(`Comparing ${userId} to ${turnIdInt}`);

    if (userId != turnIdInt) {
        alert("Not your turn!");
        console.log("Not your turn!");
        response.status(403).send("Not your turn!");
        return;
    } else {
        //check if card matches top of discard pile
        const discardIdPromise = Game.getDiscardTop(gameId);
        const discardIdObject = await discardIdPromise;
        const discardId = discardIdObject ? discardIdObject.card_id : null; // Handle empty discard

        //check if player already has a playable card in hand
        let initialCheck = false;
        const hand = await Game.getUserHand(gameId, userId);//get player hand
        for (const card of hand) {
            const cardId = card.card_id;
            let sameSuit = false;
            let sameRank = false;

            //if the top of the discard pile is not an 8
            if (discardId <= 52) {
                // Check for same suit (same chunk of 13)
                sameSuit = discardId !== null && Math.floor((cardId - 1) / 13) === Math.floor((discardId - 1) / 13);
                // Check for same rank (difference of 13)
                sameRank = discardId !== null && Math.abs(cardId % 13) === Math.abs(discardId % 13);
            } else {
                //if the top of the discard pile is an 8
                if ((discardId == 53 && cardId >= 1 && cardId <= 13) ||//spade
                    (discardId == 54 && cardId >= 14 && cardId <= 26) ||//heart
                    (discardId == 55 && cardId >= 27 && cardId <= 39) ||//diamond
                    (discardId == 56 && cardId >= 40 && cardId <= 52)) {//club
                    console.log("card is of the same suit as the resulting 8");
                    sameSuit = true;
                }
            }

            // Check if the card is an 8
            const isEight = cardId % 13 === 8; // Assuming card IDs are 1-52, rank 8

            if (sameSuit || sameRank || isEight) {
                console.log(`Found playable card: ${cardId}`);
                response.status(200).json({ message: `Got playable card ${cardId}` });
                initialCheck = true;
                break; // Exit the inner for...of loop
            }
        }
        if (initialCheck) {
            return;//found a playable card, no reason to draw cards
        } else {
            let searchDone = false;

            //keep drawing cards until you find a card that can be played, then plays it
            while (!searchDone) {
                try {
                    await Game.drawCard(gameId, userId);//move card from deck to user's hand
                    console.log(`Searching hand for cards that can be played`);
                    const hand = await Game.getUserHand(gameId, userId);

                    for (const card of hand) {
                        const cardId = card.card_id;
                        let sameSuit = false;
                        let sameRank = false;

                        //if the top of the discard pile is not an 8
                        if (discardId <= 52) {
                            // Check for same suit (same chunk of 13)
                            sameSuit = discardId !== null && Math.floor((cardId - 1) / 13) === Math.floor((discardId - 1) / 13);
                            // Check for same rank (difference of 13)
                            sameRank = discardId !== null && Math.abs(cardId % 13) === Math.abs(discardId % 13);
                        } else {
                            //if the top of the discard pile is an 8
                            if ((discardId == 53 && cardId >= 1 && cardId <= 13) ||//spade
                                (discardId == 54 && cardId >= 14 && cardId <= 26) ||//heart
                                (discardId == 55 && cardId >= 27 && cardId <= 39) ||//diamond
                                (discardId == 56 && cardId >= 40 && cardId <= 52)) {//club
                                console.log("card is of the same suit as the resulting 8");
                                sameSuit = true;
                            }
                        }
                        // Check if the card is an 8
                        const isEight = cardId % 13 === 8; // Assuming card IDs are 1-52, rank 8

                        if (sameSuit || sameRank || isEight) {
                            console.log(`Found playable card: ${cardId}`);
                            searchDone = true;
                            response.status(200).json({ message: `Drew and got playable card ${cardId}` });
                            break;
                        }
                    }

                    if (!searchDone) {
                        console.log("No playable card found in the current hand, drawing again.");
                        const deckCheck = await Game.isDeckEmpty(gameId);
                        console.log(`DECK CHECK: ${deckCheck}`);
                        if (deckCheck == true) {
                            console.log("Deck Empty! Shuffling discard pile!");
                            Game.shuffleDiscard(gameId);
                        }
                    }
                } catch (error) {
                    console.error("Error drawing card:", error);
                    response.status(500).send("Failed to draw card");
                    searchDone = true; // Exit the loop on error
                }
            }
        }

    }
});

//get top of discard deck (the card you are supposed to match)
router.get("/:gameId/getDiscardTop", async (request: Request, response: Response) => {
    const { gameId: paramsGameId } = request.params;
    const gameId = parseInt(paramsGameId);
    try {
        const card = await Game.getDiscardTop(gameId);
        response.status(200).json(card);
    } catch (error) {
        console.error("Error fetching top discard card:", error);
        response.status(500).send("Failed to fetch top discard card");
    }
});

router.get("/:gameId/hand", async (request: Request, response: Response) => {
    const { gameId: paramsGameId } = request.params;
    const gameId = parseInt(paramsGameId);

    //@ts-ignore
    const { id: userId } = request.session.user;

    try {
        const hand = await Game.getUserHand(gameId, userId);
        response.status(200).json(hand);
    } catch (error) {
        console.error("Error fetching user hand:", error);
        response.status(500).send("Failed to fetch hand");
    }
});

router.get("/:gameId/players", async (request: Request, response: Response) => {
    const { gameId: paramsGameId } = request.params;
    const gameId = parseInt(paramsGameId);

    try {
        const players = await Game.getPlayersWithHandCount(gameId);
        response.status(200).json(players);
    } catch (error) {
        console.error("Error fetching players with hand count:", error);
        response.status(500).send("Failed to fetch player information");
    }
});

//get current turn player name
router.get("/:gameId/getCurrName", async (request: Request, response: Response) => {
    console.log("Getting player name");
    const { gameId: paramsGameId } = request.params;
    const gameId = parseInt(paramsGameId);
    try {
        const playerId = await Game.whoTurn(gameId);
        console.log(`Current player's turn: ${playerId}`);
        const player = await Game.getPlayerName(playerId);
        console.log(`Player turn name ${player.player}`);
        response.status(200).json(player.player);
    } catch (error) {
        console.error("Error fetching current player name:", error);
        response.status(500).send("Failed to fetch current player name");
    }
});

//stop players from playing if somebody wins

router.get("/:gameId/winner", async (request: Request, response: Response) => { // Added the handler
    console.log("Winner detected!");
    const { gameId: paramsGameId } = request.params;
    const gameId = parseInt(paramsGameId);
    try {
        await Game.gameOver(gameId);
        response.status(200).send();
    } catch (error) {
        console.error("Error setting winner:", error);
        response.status(500).send("Failed to set win");
    }
});

router.get("/:gameId/resetGame", async (request: Request, response: Response) => {
    console.log("Resetting deck");
    const { gameId: paramsGameId } = request.params;
    const gameId = parseInt(paramsGameId);
    try {
        await Game.resetDeck(gameId);
        response.status(200).send();
    } catch (error) {
        console.error("Error resetting deck:", error);
        response.status(500).send("Failed to reset deck");
    }
});

//create new card that is the result of choosing a suit for an 8 card that the next discard can follow
router.post("/:gameId/:eightValue/generateWildResult", async (request: Request, response: Response) => {
    console.log("Generating 8 card result");
    const { gameId: paramsGameId } = request.params;
    const gameId = parseInt(paramsGameId);
    const { eightValue: paramsEightValue } = request.params; // Changed to 'eightValue'
    const eightValue = parseInt(paramsEightValue);
    console.log(`${eightValue}`);
    try {
        await Game.generateWildResult(gameId, eightValue);
        response.status(200).send();
    } catch (error) {
        console.error("Error generating 8 card result:", error);
        response.status(500).send("Failed to generate 8 card result");
    }
});

router.post("/:gameId/deleteGame", async (request: Request, response: Response) => {
    const { gameId: paramsGameId } = request.params;
    const gameId = parseInt(paramsGameId);
    Game.deleteGame(gameId);
});

//@ts-ignore
router.get("/:gameId/doesGameExist", async (request: Request, response: Response) => {
    const { gameId: paramsGameId } = request.params;
    const gameId = parseInt(paramsGameId, 10);

    console.log(`gameId: ${gameId}`);
    const gameExistsResult = await Game.gameExist(gameId);
    console.log(`gameExistsResult:`, gameExistsResult); // Print the result

    if (isNaN(gameId)) {
        return response.status(400).json({ error: 'Invalid gameId provided.' });
    }

    if (gameExistsResult) {
        console.log(`Game exists with ID: ${gameExistsResult.id}`);
        return response.status(200).json({ exists: true, id: gameExistsResult }); // Return the whole result
    } else {
        console.log(`Game with ID ${gameId} does not exist.`);
        return response.status(404).json({ exists: false, id: null });
    }
});

router.post("/:gameId/:userId/leaveGame", async (request: Request, response: Response) => {
    console.log("Leaving game");
    const { gameId: paramsGameId } = request.params;
    const gameId = parseInt(paramsGameId);
    const { userId: paramsUserId } = request.params;
    const userId = parseInt(paramsUserId);

    //check if it is this player's turn
    //@ts-ignore
    console.log(`User who is leaving: ${userId}`);


    const turnIdPromise = Game.whoTurn(gameId); //Store the Promise
    const turnIdInt = await turnIdPromise; //convert promise to int
    console.log(`Comparing users ${userId} to ${turnIdInt}`);

    //if it was this player's turn when they left
    if (userId == turnIdInt) {
        //see if we are at the seat with the highest value
        const highestSeatPromise = await Game.getHighestSeat(gameId);
        const highestSeatInt = highestSeatPromise.highest_seat;
        console.log(highestSeatInt);

        //get current player's seat number
        const currSeatPromise = await Game.getSeat(gameId, turnIdInt);
        const currSeatVal = currSeatPromise.curr_seat;

        console.log(`comparing ${currSeatVal} and ${highestSeatInt}`);
        if (currSeatVal == highestSeatInt) {
            //if we are at top seat in game turn order
            console.log("reset turn order!");
            const lowestSeatPromise = await Game.getLowestSeat(gameId);
            const lowestSeatInt = lowestSeatPromise.lowest_seat;
            console.log(lowestSeatInt);
            Game.isCurrentFlip(gameId, currSeatVal);//set is_current from true to false on current player
            Game.isCurrentFlip(gameId, lowestSeatInt);//set is_current from false to true on player with lowest seat number this game
            response.status(200).send("Turn complete!");
        } else {
            console.log("TURN OVER");
            //console.log(currSeatVal+1);
            Game.isCurrentFlip(gameId, currSeatVal);//set is_current from true to false on current player

            //add code that checks if next seat is valid (player may have left)

            let nextSeatValPromise = await Game.getNextSeat(gameId, currSeatVal);
            console.log(`next player seat: ${nextSeatValPromise.next_seat}`);

            Game.isCurrentFlip(gameId, nextSeatValPromise.next_seat);//set is_current from false to true on next player
            response.status(200).send("Turn complete!");

            try {
                await Game.leaveGame(gameId, userId);
                response.status(200).send();
            } catch (error) {
                console.error("Error leaving game:", error);
                response.status(500).send("Failed to leave game");
            }

        }
    } else {
        try {
            await Game.leaveGame(gameId, userId);
            response.status(200).send();
        } catch (error) {
            console.error("Error leaving game:", error);
            response.status(500).send("Failed to leave game");
        }
    }

});

router.post("/:gameId/setInGamePlayers", async (request: Request, response: Response) => {
    console.log("Converting all users in game to players");
    const { gameId: paramsGameId } = request.params;
    const gameId = parseInt(paramsGameId);

    try {
        await Game.spectateToPlayer(gameId);
        response.status(200).send();
    } catch (error) {
        console.error("Error setting users as players:", error);
        response.status(500).send("Failed to leave set users as players");
    }

});

router.get("/:gameId/:userId/isPlayer", async (request: Request, response: Response) => {
    console.log("Checking if user is player or spectator");
    const { gameId: paramsGameId } = request.params;
    const gameId = parseInt(paramsGameId);
    const { userId: paramsUserId } = request.params;
    const userId = parseInt(paramsUserId);

    try {
        const isPlayer = await Game.isPlayerCheck(gameId, userId); //Await the result
        response.status(200).send(isPlayer); //Send the boolean result
    } catch (error) {
        console.error("Error checking if user is player or spectator:", error);
        response.status(500).send("Failed to check if user is player or spectator");
    }
});

export default router;