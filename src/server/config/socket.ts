//connect our session middleware to sockets
//when we connect our sockets we can get info on session
//use user id to force socket to listen to io based on user id

import { Server } from "socket.io";
import { Express, RequestHandler } from "express";
import { addAIOpponent } from "../ai";
//import { sessionMiddleware } from "./session";

const configureSockets = (io: Server, app: Express, sessionMiddleware: RequestHandler) => {
    app.set("io", io);//allows us to store information on the application object, retrieve it from the request object

    io.engine.use(sessionMiddleware);

    io.on("connection", (socket) => {
        //@ts-ignore
        const { id, user } = socket.request.session;

        if (user) {
            console.log(`User [${user.id}] connected with session id: ${id}`);
            socket.join(user.id);//have socket join a room

            // --- Add AI Opponent Handler ---
            socket.on("addAI", ({ lobbyId }) => {
                const added = addAIOpponent(lobbyId);
                if (added) {
                    // Optionally, emit lobbyUpdate to all clients
                    const appIo = app.get("io");
                    if (appIo) {
                        // Re-fetch updated lobbies and emit
                        const { getLobbies } = require("../db/games");
                        appIo.emit("lobbyUpdate", getLobbies());
                    }
                }
            });

            // --- Real-Time Chat Handler ---
            socket.on("chatMessage", ({ lobbyId, message }) => {
                if (!lobbyId || !message) return;
                // Broadcast message to all clients in the lobby room
                io.to(lobbyId).emit("chatMessage", {
                    user: { id: user.id, email: user.email, gravatar: user.gravatar },
                    message,
                    timestamp: Date.now(),
                });
            });

            // --- Player Join/Leave Handlers ---
            socket.on("playerJoin", ({ lobbyId }) => {
                if (!lobbyId) return;
                socket.join(lobbyId);
                io.to(lobbyId).emit("playerJoined", {
                    user: { id: user.id, email: user.email, gravatar: user.gravatar },
                    timestamp: Date.now(),
                });
            });

            socket.on("playerLeave", ({ lobbyId }) => {
                if (!lobbyId) return;
                socket.leave(lobbyId);
                io.to(lobbyId).emit("playerLeft", {
                    user: { id: user.id, email: user.email, gravatar: user.gravatar },
                    timestamp: Date.now(),
                });
            });

            // --- Card Played Handler ---
            socket.on("cardPlayed", ({ lobbyId, card, nextPlayerId }) => {
                if (!lobbyId || !card) return;
                io.to(lobbyId).emit("cardPlayed", {
                    user: { id: user.id, email: user.email, gravatar: user.gravatar },
                    card,
                    nextPlayerId,
                    timestamp: Date.now(),
                });
            });

            socket.on("disconnect", () => {
                console.log(`User [${user.id}] disconnected`);
                socket.leave(user.id);
            });
        } else {
            console.log(`Anonymous user connected with session id: ${id}`);
            
            socket.on("disconnect", () => {
                console.log(`Anonymous user disconnected`);
            });
        }
    })
}

export default configureSockets;
