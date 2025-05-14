"use strict";
const createGameButton = document.querySelector("#create-game-button");
const createGameContainer = document.querySelector("#create-game-container");
const closeButton = document.querySelector("#close-create-game-form");
createGameButton === null || createGameButton === void 0 ? void 0 : createGameButton.addEventListener("click", (event) => {
    event.preventDefault();
    createGameContainer === null || createGameContainer === void 0 ? void 0 : createGameContainer.classList.add("visible");
});
closeButton === null || closeButton === void 0 ? void 0 : closeButton.addEventListener("click", (event) => {
    event.preventDefault();
    createGameContainer === null || createGameContainer === void 0 ? void 0 : createGameContainer.classList.remove("visible");
});
createGameContainer === null || createGameContainer === void 0 ? void 0 : createGameContainer.addEventListener("click", (event) => {
    if (createGameContainer !== event.target) {
        return;
    }
    createGameContainer === null || createGameContainer === void 0 ? void 0 : createGameContainer.classList.remove("visible");
});
