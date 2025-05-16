"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// /chat/*
router.post("/:roomId", (request, response) => {
    const { roomId } = request.params;
    const { message } = request.body;
    //@ts-ignore
    const { id, email, gravatar } = request.session.user;
    const io = request.app.get("io");
    if (!io) {
        response.status(500).send("Socket.io not initialized");
        return;
    }
    if (!message) {
        response.status(400).send("Message is required");
        return;
    }
    io.emit(`chat:message:${roomId}`, {
        message,
        sender: {
            id,
            email,
            gravatar,
        },
        timestamp: new Date(),
    });
    response.status(200).send();
});
exports.default = router;
