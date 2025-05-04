//console.log("Hello from the client (games)");

const startGameButton = document.querySelector("#start-game-button");

function getGameId(): string | number {
    const path = window.location.pathname; //gets the pathname
    if (path.startsWith("/games/")) {
        const pathParts = path.split("/");
        if (pathParts.length > 2 && pathParts[2]) {
            return pathParts[2];
        }
    }
    return 0;
}

startGameButton?.addEventListener("click", event =>{
    event.preventDefault();
    console.log(`games/${getGameId()}/start)`);
    fetch(`games/${getGameId()}/start)`, {
        method: "post",
    });
})