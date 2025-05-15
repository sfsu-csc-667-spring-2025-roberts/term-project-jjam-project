import { createChatComponent } from "./Chat";

document.addEventListener("DOMContentLoaded", () => {
  const heading = document.createElement("h1");
  heading.textContent = "Crazy 8s Online Lobby";
  document.body.appendChild(heading);

  const toggleButton = document.createElement("button");
  toggleButton.textContent = "Show Chat";
  document.body.appendChild(toggleButton);

  const chatComponent = createChatComponent("example-lobby-id");
  chatComponent.style.display = "none";
  document.body.appendChild(chatComponent);

  let showChat = false;
  toggleButton.addEventListener("click", () => {
    showChat = !showChat;
    chatComponent.style.display = showChat ? "block" : "none";
    toggleButton.textContent = showChat ? "Hide Chat" : "Show Chat";
  });
});
