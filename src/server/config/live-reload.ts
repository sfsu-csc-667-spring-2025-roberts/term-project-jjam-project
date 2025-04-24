import type { Express } from "express";
import path from "path";

const configureReload = (app: Express) => {
    if(process.env.NODE_ENV !== "development"){
        return;
    }

    const reloadServer = require("livereload").createServer();
    const connectLivereload = require("connect-livereload");

    reloadServer.watch(path.join(process.cwd(), "public", "js"));

    reloadServer.server.once("connection", () => {
        setTimeout(() => {
            reloadServer.refresh("/");
        }, 100);
    });

    app.use(
        connectLivereload()
    );
    // if(process.env.NODE_ENV === "development") {
    //     const livereload = require("connect-livereload");
    //     const livereloadMiddleware = livereload({
    //         port: 35729,
    //         applyScriptTag: true,

    //     });
    //     app.use(livereloadMiddleware);
    //     app.get("/livereload.js", (req, res) => {
    //         res.setHeader("Content-Type", "application/javascript");
    //         res.send(livereloadMiddleware.getClientScript());
    //     });
    // }
};

export default configureReload;