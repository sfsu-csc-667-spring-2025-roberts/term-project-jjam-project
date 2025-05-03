import type {Request, Response, NextFunction} from "express";

const authMiddleware = (request: Request, response: Response, next: NextFunction) => {
    if(request.params.roomId !== undefined){
        response.locals.roomId = request.params.roomId;//in game
    }else if (request.path.startsWith('/games/')) {
        // If the path starts with '/game/', try to extract the roomId
        // Assuming the route is something like '/game/:roomId'
        const pathParts = request.path.split('/');
        if (pathParts.length > 2 && pathParts[2]) {
        response.locals.roomId = pathParts[2];
        } 
    }else{
        response.locals.roomId = 0;//main lobby
    }

    next();//proceeds to next middleware
}

export default authMiddleware;