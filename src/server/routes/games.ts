import express from "express";
import {Request, Response } from "express";

import { Game } from "../db";

const router = express.Router();

router.post("/create", async (request: Request, response: Response) => {
    // @ts-ignore
    const { id: userId } = request.session.user;
    const { description, minPlayers, maxPlayers, password } = request.body;

    try {
        const gameId = await Game.create(description, minPlayers, maxPlayers, password, userId);

        response.redirect(`/games/${gameId}`);
    }catch (error) {
        console.log({error});
        response.redirect("/lobby");
    }
});

router.post("/join/:gameId", async (request: Request, response: Response) => {
    const { gameId } = request.params;
    const { password } = request.body;
    //@ts-ignore
    const{ id: userId } = request.session.user;

    try { 
        const playerCount = await Game.join(userId, parseInt(gameId), password);
        console.log({playerCount});
        response.redirect(`/games/${gameId}`);
    } catch(error){
        console.log({error});
        response.redirect("/lobby");
    }
});

router.get("/:gameId", async (request: Request, response: Response) => {
    const { gameId: paramsGameId } = request.params;
    const gameId = parseInt(paramsGameId);

    //@ts-ignore
    const{ id: userId } = request.session.user;
    const hostId = await Game.getHost(gameId);

    console.log({hostId, userId, gameId});

    response.render("games", { gameId, isHost: hostId === userId });
});

router.post("/:gameId/start", async (request:Request, response: Response) => {
    const { gameId: paramsGameId } = request.params;
    const gameId = parseInt(paramsGameId);

    //@ts-ignore
    const { id: userId } = request.session.user;
    const hostId = await Game.getHost(gameId);

    console.log({gameId, userId, hostId});

    //validation
    //ensure host is starting
    if(hostId !== userId){
        response.status(200).send();
        return;
    }
    //ensure there are minimum number of players
    const gameInfo = await Game.getInfo(gameId);
    //console.log({gameInfo});

    if(gameInfo.min_players < gameInfo.player_count){

        //TODO: Broadcast game update stating "not enough players"
        response.status(200).send();
        return;
    }
    await Game.start(gameId);

    //add cards to game
    //deal cards
    //set current player
    //let players know the game has started



    response.status(200).send();
});

export default router;