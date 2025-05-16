"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("../db");
const router = express_1.default.Router();
// this possibly does not work but i am praying to the gods of code -MAzen
router.post("/create", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userId } = request.session.user;
    const { description, minPlayers, maxPlayers, password } = request.body;
    try {
        const gameId = yield db_1.Game.create(description, minPlayers, maxPlayers, password, userId);
        response.redirect(`/games/${gameId}`);
    }
    catch (error) {
        console.log({ error });
        response.redirect("/lobby");
    }
}));
router.post("/join/:gameId", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { gameId } = request.params;
    const { password } = request.body;
    const { id: userId } = request.session.user;
    try {
        const playerCount = yield db_1.Game.join(userId, parseInt(gameId), password);
        console.log({ playerCount });
        response.redirect(`/games/${gameId}`);
    }
    catch (error) {
        console.log({ error });
        response.redirect("/lobby");
    }
}));
router.get("/:gameId", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { gameId } = request.params;
    // Load latest state for rejoin/resume support
    let gameState = {};
    try {
        gameState = yield db_1.Game.loadState(parseInt(gameId));
    }
    catch (e) {
        console.log('No state found for game', gameId);
    }
    response.render("games", { gameId, gameState });
}));
exports.default = router;
