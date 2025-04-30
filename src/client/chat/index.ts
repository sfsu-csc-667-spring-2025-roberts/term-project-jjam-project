//console.log("Hello from the client (chat)");

import { ChatMessage } from "../../../types/global";
import { socket } from "../sockets";

const roomId = document.querySelector<HTMLInputElement>("#room-id")?.value;


function scrollChatToBottom() {
    const chatContainer = document.querySelector<HTMLDivElement>(
        "#chat-container .chat-messages"
    );
    if (chatContainer) {
        chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: 'smooth' });
    }
}

const chatContainer = document.querySelector<HTMLDivElement>(
    "#chat-container .chat-messages"
);

socket.on("chat:message:0", ({message, sender, timestamp}: ChatMessage) => {
    const container = document.querySelector<HTMLTemplateElement>("#chat-message-template")?.content.cloneNode(true) as HTMLDivElement;
    
    const img = container.querySelector<HTMLImageElement>("img")!;

    img.src = `https://gravatar.com/avatar/${sender.gravatar}?d=identicon`;
    img.alt = `Gravatar for ${sender.email}`;

    container.querySelector<HTMLSpanElement>(".message-content")!.innerText = message;
    container.querySelector<HTMLSpanElement>(".message-timestamp")!.innerText = new Date(timestamp).toLocaleTimeString();

    chatContainer?.appendChild(container);
    scrollChatToBottom(); // Animate scroll to bottom
    
});

const chatForm = document.querySelector<HTMLFormElement>(
    "#chat-container form"
);

const chatInput = document.querySelector<HTMLInputElement>(
    "#chat-container input"
);

chatInput?.addEventListener('focus', () => {
    chatInput.style.boxShadow = '0 0 0 3px #4f8cff55';
});
chatInput?.addEventListener('blur', () => {
    chatInput.style.boxShadow = '';
});


chatForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = chatInput?.value;
    if (!message){
        return;
    } 
    chatInput.value = "";

    fetch(`/chat/${roomId}`, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message,
        }),
    }).catch((error)=>{
        console.error("Error sending message:", error);
    })
});
// socket.on("test-event", (data: any) => { 
//     console.log("Received test-event:", data);
// })