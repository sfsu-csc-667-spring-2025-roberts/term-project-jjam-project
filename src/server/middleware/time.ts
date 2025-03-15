import {NextFunction, Request, Response} from 'express';

//arbitrary middleware that prints out the time when a request is made, testing how to do middleware and how it works
const timeMiddleware = (_request: Request, _response: Response, next: NextFunction) => {
    //console.log("Request made at ", new Date().toISOString());
    console.log(`Request made at ${new Date().toISOString()}`);
    next();
};

export {timeMiddleware};