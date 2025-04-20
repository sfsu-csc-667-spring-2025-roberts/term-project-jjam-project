import type {Request, Response, NextFunction} from "express";

const authMiddleware = (request: Request, response: Response, next: NextFunction) => {
    if(request.params.roomId !== undefined){
        response.locals.roomId = request.params.roomId;//in game
    }else{
        response.locals.roomId = 0;//main lobby
    }

    next();//proceeds to next middleware
}

export default authMiddleware;