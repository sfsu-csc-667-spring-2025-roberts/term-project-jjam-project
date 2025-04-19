import type { Express, RequestHandler } from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";

//let sessionMiddleware: RequestHandler | undefined



const configureSession = (app: Express) => {
    const store = new (connectPgSimple(session))({
        createTableIfMissing: true,
    });
    const sessionMiddleware = session({
        store,
        secret: process.env.SESSION_SECRET!,
        resave: true,
        saveUninitialized: false

        // store: new (connectPgSimple(session))({
        //     createTableIfMissiong: true;
        // })
    });
    app.use(sessionMiddleware);
    return sessionMiddleware;
}

export default configureSession;
//export { sessionMiddleware };