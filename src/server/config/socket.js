"use strict";
//connect our session middleware to sockets
//when we connect our sockets we can get info on session
//use user id to force socket to listen to io based on user id
Object.defineProperty(exports, "__esModule", { value: true });
//import { sessionMiddleware } from "./session";
const configureSockets = (io, app, sessionMiddleware) => {
    app.set("io", io); //allows us to store information on the application object, retrieve it from the request object
    io.engine.use(sessionMiddleware);
    io.on("connection", (socket) => {
        //@ts-ignore
        const { id, user } = socket.request.session;
        if (user) {
            console.log(`User [${user.id}] connected with session id: ${id}`);
            socket.join(user.id); //have socket join a room
            socket.on("disconnect", () => {
                console.log(`User [${user.id}] disconnected`);
                socket.leave(user.id);
            });
        }
        else {
            console.log(`Anonymous user connected with session id: ${id}`);
            socket.on("disconnect", () => {
                console.log(`Anonymous user disconnected`);
            });
        }
    });
};
exports.default = configureSockets;
