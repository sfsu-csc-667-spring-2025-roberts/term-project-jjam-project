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
        response.redirect("/lobby");
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

    if (gameInfo.min_players < gameInfo.player_count) {

        //TODO: Broadcast game update stating "not enough players"
        response.status(200).send();
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
router.post("/:gameId/:cardId/discard", async (request: Request, response: Response) => {
    const { gameId: paramsGameId } = request.params;
    const gameId = parseInt(paramsGameId);

    //card that player wants to discard
    const { cardId: paramsCardId } = request.params;
    const cardId = parseInt(paramsCardId);

    //check if it is this player's turn
    //@ts-ignore
    const { id: userId } = request.session.user;
    console.log(`User who is discarding: ${userId}`);

    const turnIdPromise = Game.whoTurn(gameId); //Store the Promise
    const turnIdInt = await turnIdPromise; //convert promise to int
    console.log(`Comparing users ${userId} to ${turnIdInt}`);

    if (userId != await turnIdInt) {
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

        // Check for same suit (same chunk of 13)
        const sameSuit = Math.floor((cardId - 1) / 13) === Math.floor((discardId - 1) / 13);

        // Check for same rank
        const sameRank = cardRank === discardRank;

        // Check if the card is an 8
        const isEight = cardId % 13 === 8; // Assuming card IDs are 1-52, rank 8

        if (sameSuit || sameRank || isEight) {
            console.log(`Card being discarded`);

            //move topdiscard card to pile 2
            await Game.moveDiscard(gameId);

            console.log(`Discard pile clear!`);
            //add player's selected card to discard
            const fromUserId = userId;
            console.log(`Discarding ${gameId}, ${cardId}, ${fromUserId}`);
            await Game.discardSelectedCard(gameId, cardId);
            console.log(`Discard successful! ${cardId}`);

            response.status(200).send(`Discard successful! ${cardId}`);
            
            //next player's turn

            //see if we are at the seat with the highest value
            const highestSeatPromise = await Game.getHighestSeat(gameId);
            const highestSeatInt = highestSeatPromise.highest_seat;
            console.log(highestSeatInt);

            //get current player's seat number
            const currSeatPromise = await Game.getSeat(gameId, turnIdInt);
            const currSeatVal = currSeatPromise.curr_seat;

            console.log(`comparing ${currSeatVal} and ${highestSeatInt}`);
            if(currSeatVal == highestSeatInt){
                //if we are at top seat in game turn order
                console.log("reset turn order!");
                const lowestSeatPromise = await Game.getLowestSeat(gameId);
                const lowestSeatInt = lowestSeatPromise.lowest_seat;
                console.log(lowestSeatInt);
                Game.isCurrentFlip(gameId, currSeatVal);//set is_current from true to false on current player
                Game.isCurrentFlip(gameId, lowestSeatInt);//set is_current from false to true on player with lowest seat number this game
                //response.status(200).send("Turn complete!");
            }else{
                console.log("TURN OVER");
                //console.log(currSeatVal+1);
                Game.isCurrentFlip(gameId, currSeatVal);//set is_current from true to false on current player
                Game.isCurrentFlip(gameId, currSeatVal+1);//set is_current from false to true on next player
                //response.status(200).send("Turn complete!");
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
            // Check for same suit (same chunk of 13)
            const sameSuit = discardId !== null && Math.floor((cardId - 1) / 13) === Math.floor((discardId - 1) / 13);

            // Check for same rank (difference of 13)
            const sameRank = discardId !== null && Math.abs(cardId % 13) === Math.abs(discardId % 13);

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

                        // Check for same suit (same chunk of 13)
                        const sameSuit = discardId !== null && Math.floor((cardId - 1) / 13) === Math.floor((discardId - 1) / 13);

                        // Check for same rank (difference of 13)
                        const sameRank = discardId !== null && Math.abs(cardId % 13) === Math.abs(discardId % 13);

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
                        if(deckCheck){
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
router.get("/:gameId/discardTop", async (request: Request, response: Response) => {
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
export default router;