"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authMiddleware = (request, response, next) => {
    if (request.params.roomId !== undefined) {
        response.locals.roomId = request.params.roomId; //in game
    }
    else {
        response.locals.roomId = 0; //main lobby
    }
    next(); //proceeds to next middleware
};
exports.default = authMiddleware;
