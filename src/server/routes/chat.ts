import express from "express";

import { Request, Response } from "express";

const router = express.Router();

// /chat/*
router.post("/:roomId", (request: Request, response: Response) => {
    const { roomId } = request.params;
    const { message } = request.body;
    //@ts-ignore
    const { id, email, gravatar } = request.session.user;
    const io = request.app.get("io");

    if(!io){
        response.status(500).send("Socket.io not initialized");
        return;
    }

    if (!message){
        response.status(400).send("Message is required");
        return;
    }

    io.emit(`chat:message:${roomId}`, {
        message,
        sender: {
            id,
            email,
            gravatar,
        },
        timestamp: new Date(),
    });

    response.status(200).send();
});

export default router;

