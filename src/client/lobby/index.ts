const createGameButton = document.querySelector("#create-game-button");
const createGameForm = document.querySelector("#create-game-container");


createGameButton?.addEventListener("click", (event) => {
    event.preventDefault();
    createGameForm?.classList.add("visible");
});  