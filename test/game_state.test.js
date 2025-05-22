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
// Test for saveState and loadState
const games_1 = __importDefault(require("../../src/server/db/games"));
const testGameId = 1;
const testState = { foo: "bar", turn: 2, cards: [1, 2, 3] };
function runTests() {
    return __awaiter(this, void 0, void 0, function* () {
        // Save state
        yield games_1.default.saveState(testGameId, testState);
        console.log("Saved state.");
        // Load state
        const loaded = yield games_1.default.loadState(testGameId);
        console.log("Loaded state:", loaded);
        if (JSON.stringify(loaded) === JSON.stringify(testState)) {
            console.log("Test passed: Game state matches.");
        }
        else {
            console.error("Test failed: Loaded state does not match.");
        }
    });
}
runTests().catch(console.error);
