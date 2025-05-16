"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeMiddleware = void 0;
//arbitrary middleware that prints out the time when a request is made, testing how to do middleware and how it works
const timeMiddleware = (_request, _response, next) => {
    //console.log("Request made at ", new Date().toISOString());
    console.log(`Request made at ${new Date().toISOString()}`);
    next();
};
exports.timeMiddleware = timeMiddleware;
