const createGameButton = document.querySelector("#create-game-button");
const createGameContainer = document.querySelector("#create-game-container");
const closeButton = document.querySelector("#close-create-game-form");
const joinForm = document.querySelector<HTMLFormElement>('form[action^="/games/join/"]'); // Select the first form with the specified action

createGameButton?.addEventListener("click", (event) => {
    event.preventDefault();
    createGameContainer?.classList.add("visible");
});

closeButton?.addEventListener("click", (event) =>{
    event.preventDefault();
    createGameContainer?.classList.remove("visible");

});

createGameContainer?.addEventListener("click", (event) => {
    if(createGameContainer !== event.target){
        return;
    }
    createGameContainer?.classList.remove("visible");
});

joinForm?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const roomIdInput = joinForm.querySelector<HTMLInputElement>('#roomId');
    const passwordInput = joinForm.querySelector<HTMLInputElement>('#password');

    if (roomIdInput) {
        const roomId = roomIdInput.value;
        const password = passwordInput?.value || ""; // Default to empty string if no password

        try {
            // Assuming 'userId' is available in the session or a global context
            const response = await fetch(`/games/join/${roomId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password: password }),
            });

            if (response.ok) {
                window.location.href = `/games/${roomId}`;
            } else {
                const errorData = await response.json();
                console.error('Failed to join game:', errorData);
                // Optionally display an error message to the user
            }
        } catch (error) {
            console.error('Error joining game:', error);
            // Optionally display an error message to the user
        }
    }
});