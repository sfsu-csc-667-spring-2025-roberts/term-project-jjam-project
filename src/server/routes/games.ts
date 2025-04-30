import express from "express";
import {Request, Response } from "express";

import { Game } from "../db";

const router = express.Router();
// this possibly does not work but i am praying to the gods of code -MAzen
router.post("/create", async (request: Request, response: Response) => {
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
    const { gameId } = request.params;
    // Load latest state for rejoin/resume support
    let gameState = {};
    try {
        gameState = await Game.loadState(parseInt(gameId));
    } catch (e) {
        console.log('No state found for game', gameId);
    }
    response.render("games", { gameId, gameState });
});

export default router;