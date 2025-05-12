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
router.post("/:gameId/:cardId/discard", async(request: Request, response: Response) =>{
    const { gameId: paramsGameId} = request.params;
    const gameId = parseInt(paramsGameId);

    const { cardId: paramsCardId} = request.params;
    const cardId = parseInt(paramsCardId);

    //check if it is this player's turn
    //@ts-ignore
    const { id: userId } = request.session.user;
    console.log(`User who is discarding: ${userId}`);

    const turnIdPromise = Game.whoTurn(gameId); //Store the Promise
    const turnIdInt = await turnIdPromise; //convert promise to int
    console.log(`Comparing users ${userId} to ${turnIdInt}`);

    if(userId != await turnIdInt){
        console.log("Not your turn!");
        response.status(403).send("Not your turn!");
    }else{
        //check if player's selected card matches the discard card number or suit
        const discardIdPromise = Game.getDiscardTop(gameId);
        const discardIdObject = await discardIdPromise;
        const discardId = discardIdObject.card_id;
        console.log(`Comparing cards ${cardId} and ${discardId}`);

        // Check for same suit (same chunk of 13)
        const sameSuit = Math.floor((cardId - 1) / 13) === Math.floor((discardId - 1) / 13);

        // Check for same rank (difference of 13)
        const sameRank = Math.abs(cardId - discardId) === 13;
        if(sameSuit || sameRank){
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
        }else{
            console.log("Card doesn't match!");
            response.status(403).send("Card doesn't match!");
        }
        
    }

    
});

//draw a card
router.post("/:gameId/draw", async(request: Request, response: Response) =>{
    const { gameId: paramsGameId} = request.params;
    const gameId = parseInt(paramsGameId);

    //check if it is this player's turn
    //@ts-ignore
    const { id: userId } = request.session.user;
    console.log(`User who is drawing: ${userId}`);

    const turnIdPromise = Game.whoTurn(gameId); //Store the Promise
    const turnIdInt = await turnIdPromise; //convert promise to int
    console.log(`Comparing ${userId} to ${turnIdInt}`);

    if(userId != await turnIdInt){
        console.log("Not your turn!");
        response.status(403).send("Not your turn!");
    }else{
        //move card from deck to user's hand
        try {
            await Game.drawCard(gameId, userId);//draw hand
            response.status(200).json();
        } catch (error) {
            console.error("Error drawing card:", error);
            response.status(500).send("Failed to draw card");
        }
        console.log(`Draw successful! ${userId}`);
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

export default router;