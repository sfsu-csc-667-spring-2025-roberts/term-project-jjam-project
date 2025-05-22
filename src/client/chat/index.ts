//console.log("Hello from the client (chat)");

import { ChatMessage } from "../../../types/global";
import { socket } from "../sockets";

// Get the room ID from the input field
const roomId = document.querySelector<HTMLInputElement>("#room-id")?.value;

// Select the chat container div inside the #chat-container
const chatContainer = document.querySelector<HTMLDivElement>(
    "#chat-container div"
);

// Listen for incoming chat messages from the server
socket.on(`chat:message:${roomId}`, ({ message, sender, timestamp }: ChatMessage) => {
    // Create a chat message using a template
    const container = document.querySelector<HTMLTemplateElement>("#chat-message-template")?.content.cloneNode(true) as HTMLDivElement;

    const img = container.querySelector<HTMLImageElement>("img")!;
    img.src = `https://gravatar.com/avatar/${sender.gravatar}?d=identicon`;
    img.alt = `Gravatar for ${sender.email}`;

    container.querySelector<HTMLSpanElement>(".message-content")!.innerText = message;
    container.querySelector<HTMLSpanElement>(".message-timestamp")!.innerText = new Date(timestamp).toLocaleTimeString();

    // Add the message to the chat container
    chatContainer?.appendChild(container);
});

// Get the form and input field from the DOM
const chatForm = document.querySelector<HTMLFormElement>(
    "#chat-container form"
);
const chatInput = document.querySelector<HTMLInputElement>(
    "#chat-container input"
);

// Handle sending chat messages
chatForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = chatInput?.value;
    if (!message) {
        return;
    }

    chatInput.value = "";

    // Send the message to the server
    fetch(`/chat/${roomId}`, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message,
        }),
    }).catch((error) => {
        console.error("Error sending message:", error);
    });
});

// socket.on("test-event", (data: any) => {
//     console.log("Received test-event:", data);
// });
