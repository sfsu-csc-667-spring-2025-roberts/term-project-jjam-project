const createGameButton = document.querySelector("#create-game-button");
const createGameContainer = document.querySelector("#create-game-container");
const closeButton = document.querySelector("#close-create-game-form");
const joinForm = document.querySelector<HTMLFormElement>('form[action^="/games/join/"]');

// Open modal
createGameButton?.addEventListener("click", (event) => {
  event.preventDefault();
  createGameContainer?.classList.add("visible");
});

// Close modal via close button
closeButton?.addEventListener("click", (event) => {
  event.preventDefault();
  createGameContainer?.classList.remove("visible");
});

// Close modal by clicking outside the form
createGameContainer?.addEventListener("click", (event) => {
  if (event.target === createGameContainer) {
    createGameContainer.classList.remove("visible");
  }
});

// Join existing game
joinForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const roomIdInput = joinForm.querySelector<HTMLInputElement>("#roomId");
  const passwordInput = joinForm.querySelector<HTMLInputElement>("#password");

  if (roomIdInput) {
    const roomId = roomIdInput.value;
    const password = passwordInput?.value || "";

    try {
      const response = await fetch(`/games/join/${roomId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        window.location.href = `/games/${roomId}`;
      } else {
        const errorData = await response.json();
        console.error("Failed to join game:", errorData);
      }
    } catch (error) {
      console.error("Error joining game:", error);
    }
  }
});

// Create new game
const createGameForm = document.getElementById("create-game-form");

createGameForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const descriptionInput = document.getElementById("game-description") as HTMLInputElement | null;
  const minInput = document.getElementById("min-players") as HTMLInputElement | null;
  const maxInput = document.getElementById("max-players") as HTMLInputElement | null;
  const passwordInput = document.getElementById("game-password") as HTMLInputElement | null;

  const description = descriptionInput?.value || "";
  const minPlayers = parseInt(minInput?.value || "2");
  const maxPlayers = parseInt(maxInput?.value || "4");
  const password = passwordInput?.value || "";

  fetch("/api/games/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ description, minPlayers, maxPlayers, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data && data.lobbyId) {
        window.location.href = `/lobby/${data.lobbyId}`;
      } else {
        console.error("Game creation failed:", data);
      }
    })
    .catch((err) => console.error("Error creating game:", err));
});
