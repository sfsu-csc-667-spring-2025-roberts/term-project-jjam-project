"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// --- TEMPORARY AUTH BYPASS FOR TESTING ONLY ---
const authMiddleware = (request, response, next) => {
    if (!request.session) request.session = {};
    request.session.user = {
        id: 'test-bypass-user',
        email: 'bypass@example.com',
        gravatar: '',
        username: 'BypassUser'
    };
    response.locals.user = request.session.user;
    next();
};
// --- END BYPASS ---
exports.default = authMiddleware;
