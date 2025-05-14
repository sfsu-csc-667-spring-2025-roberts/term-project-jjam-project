// Test for saveState and loadState
import { saveGame, getGame, GameState } from "../../src/server/db/games";

const testGameId = "test-1";
const testState: any = { id: testGameId, foo: "bar", turn: 2, cards: [1,2,3] };

async function runTests() {
    // Save state
    saveGame(testState as GameState);
    console.log("Saved state.");

    // Load state
    const loaded = getGame(testGameId);
    console.log("Loaded state:", loaded);

    if (JSON.stringify(loaded) === JSON.stringify(testState)) {
        console.log("Test passed: Game state matches.");
    } else {
        console.error("Test failed: Loaded state does not match.");
    }
}

runTests();
