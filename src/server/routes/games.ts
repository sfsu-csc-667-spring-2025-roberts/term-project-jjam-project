import express from "express";
import {Request, Response } from "express";

import { getGame, saveGame, GameState } from "../db/games";

const router = express.Router();
// this possibly does not work but i am praying to the gods of code -MAzen
// TODO: Implement game creation logic
router.post("/create", async (request: Request, response: Response) => {
    // const { id: userId } = request.session.user;
    // const { description, minPlayers, maxPlayers, password } = request.body;
    // try {
    //     const gameId = await createGame(description, minPlayers, maxPlayers, password, userId);
    //     response.redirect(`/games/${gameId}`);
    // }catch (error) {
    //     console.log({error});
    //     response.redirect("/lobby");
    // }
    response.status(501).json({ error: 'Not implemented' });
});

// TODO: Implement join game logic
router.post("/join/:gameId", async (request: Request, response: Response) => {
    // const { gameId } = request.params;
    // const { password } = request.body;
    // const userId = request.session.user?.id;
    // try { 
    //     const playerCount = await joinGame(userId, parseInt(gameId), password);
    //     console.log({playerCount});
    //     response.redirect(`/games/${gameId}`);
    // } catch(error){
    //     console.log({error});
    //     response.redirect("/lobby");
    // }
    response.status(501).json({ error: 'Not implemented' });
});

router.get("/:gameId", async (request: Request, response: Response) => {
    const { gameId } = request.params;
    // Load latest state for rejoin/resume support
    let gameState = {};
    try {
        // TODO: Replace with actual loadState logic
        gameState = getGame(gameId) || {};
    } catch (e) {
        console.log('No state found for game', gameId);
    }
    response.render("games", { gameId, gameState });
});

export default router;