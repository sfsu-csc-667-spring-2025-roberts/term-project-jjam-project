//console.log("Hello from the client (chat)");

import { ChatMessage } from "../../../types/global";
import { socket } from "../sockets";

const roomId = document.querySelector<HTMLInputElement>("#room-id")?.value;


const chatContainer = document.querySelector<HTMLDivElement>(
    "#chat-container div"
);

socket.on(`chat:message:${roomId}`, ({message, sender, timestamp}: ChatMessage) => {
    //do something with this
    //console.log("chat message", {message, sender, timestamp});

    //allows us to use a premade template instead of building the html within this page every time a message is made
    const container = document.querySelector<HTMLTemplateElement>("#chat-message-template")?.content.cloneNode(true) as HTMLDivElement;

    const img = container.querySelector<HTMLImageElement>("img")!;

    img.src = `https://gravatar.com/avatar/${sender.gravatar}?d=identicon`;
    img.alt = `Gravatar for ${sender.email}`;

    container.querySelector<HTMLSpanElement>(".message-content")!.innerText = message;
    container.querySelector<HTMLSpanElement>(".message-timestamp")!.innerText = new Date(timestamp).toLocaleTimeString();

    chatContainer?.appendChild(container);
});

const chatForm = document.querySelector<HTMLFormElement>(
    "#chat-container form"
);

const chatInput = document.querySelector<HTMLFormElement>(
    "#chat-container input"
);

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