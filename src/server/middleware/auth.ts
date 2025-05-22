import type {Request, Response, NextFunction} from "express";

// --- TEMPORARY AUTH BYPASS FOR TESTING ONLY ---
const authMiddleware = (request: Request, response: Response, next: NextFunction) => {
    // Set a dummy user for all requests
    //@ts-ignore
    request.session.user = {
        id: 'test-bypass-user',
        email: 'bypass@example.com',
        gravatar: '',
        username: 'BypassUser'
    };
    //@ts-ignore
    response.locals.user = request.session.user;
    next();
}
// --- END BYPASS ---

export default authMiddleware;