// Test for saveState and loadState
import Game from "../../src/server/db/games";

const testGameId = 1;
const testState = { foo: "bar", turn: 2, cards: [1,2,3] };

async function runTests() {
    // Save state
    await Game.saveState(testGameId, testState);
    console.log("Saved state.");

    // Load state
    const loaded = await Game.loadState(testGameId);
    console.log("Loaded state:", loaded);

    if (JSON.stringify(loaded) === JSON.stringify(testState)) {
        console.log("Test passed: Game state matches.");
    } else {
        console.error("Test failed: Loaded state does not match.");
    }
}

runTests().catch(console.error);
