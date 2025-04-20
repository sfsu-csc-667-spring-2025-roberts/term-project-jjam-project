//connect our session middleware to sockets
//when we connect our sockets we can get info on session
//use user id to force socket to listen to io based on user id

import { Server } from "socket.io";
import { Express, RequestHandler } from "express";
//import { sessionMiddleware } from "./session";

const configureSockets = (io: Server, app: Express, sessionMiddleware: RequestHandler) => {
    app.set("io", io);//allows us to store information on the application object, retrieve it from the request object

    io.engine.use(sessionMiddleware);

    io.on("connection", (socket) => {
        //@ts-ignore
        const { id, user } = socket.request.session;

        console.log(`User [${user.id}] connected with session id: ${id}`);
        socket.join(user.id);//have socket join a room

        socket.on("disconnect", () => {
            console.log(`User [${user.id}] disconnected`);
            socket.leave(user.id);
        })
    })
}

export default configureSockets;