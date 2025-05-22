import { sendChatMessage, onChatMessage } from "../sockets";

export function createChatComponent(lobbyId: string): HTMLElement {
  const chatContainer = document.createElement("div");
  chatContainer.style.border = "1px solid #ccc";
  chatContainer.style.padding = "8px";
  chatContainer.style.borderRadius = "4px";
  chatContainer.style.maxWidth = "400px";

  const messagesContainer = document.createElement("div");
  messagesContainer.style.maxHeight = "200px";
  messagesContainer.style.overflowY = "auto";
  messagesContainer.style.marginBottom = "8px";

  const form = document.createElement("form");
  form.style.display = "flex";
  form.style.gap = "4px";

  const input = document.createElement("input");
  input.placeholder = "Type a message...";
  input.style.flex = "1";

  const sendBtn = document.createElement("button");
  sendBtn.type = "submit";
  sendBtn.textContent = "Send";

  form.appendChild(input);
  form.appendChild(sendBtn);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (text) {
      sendChatMessage(lobbyId, text);
      input.value = "";
    }
  });

  onChatMessage((msg) => {
    const messageEl = document.createElement("div");
    messageEl.innerHTML = `<b>${msg.user.email}:</b> ${msg.message}`;
    messagesContainer.appendChild(messageEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  });

  chatContainer.appendChild(messagesContainer);
  chatContainer.appendChild(form);

  return chatContainer;
}
