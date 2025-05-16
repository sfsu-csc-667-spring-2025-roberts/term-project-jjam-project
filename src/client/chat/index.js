"use strict";
//console.log("Hello from the client (chat)");
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const sockets_1 = require("../sockets");
const roomId = (_a = document.querySelector("#room-id")) === null || _a === void 0 ? void 0 : _a.value;
const chatContainer = document.querySelector("#chat-container div");
sockets_1.socket.on("chat:message:0", ({ message, sender, timestamp }) => {
    //do something with this
    //console.log("chat message", {message, sender, timestamp});
    var _a;
    //allows us to use a premade template instead of building the html within this page every time a message is made
    const container = (_a = document.querySelector("#chat-message-template")) === null || _a === void 0 ? void 0 : _a.content.cloneNode(true);
    const img = container.querySelector("img");
    img.src = `https://gravatar.com/avatar/${sender.gravatar}?d=identicon`;
    img.alt = `Gravatar for ${sender.email}`;
    container.querySelector(".message-content").innerText = message;
    container.querySelector(".message-timestamp").innerText = new Date(timestamp).toLocaleTimeString();
    // const container = document.createElement("div");
    // container.classList.add("message");
    //const img = document.createElement("img");
    // img.src = `https://gravatar.com/avatar/${sender.gravatar}?d=identicon`;
    // img.alt = `Gravatar for ${sender.email}`;
    // img.classList.add("avatar");
    // container.appendChild(img);
    // const messageContainer = document.createElement("div");
    // messageContainer.classList.add("message-wrapper");
    // const messageContent = document.createElement("span");
    // messageContent.classList.add("message-content");
    // messageContent.innerText = message;
    // const messageTimestamp = document.createElement("span");
    // messageTimestamp.classList.add("message-timestamp");
    // messageTimestamp.innerText = new Date(timestamp).toLocaleTimeString();
    // messageContainer.appendChild(messageContent);
    // messageContainer.appendChild(messageTimestamp);
    // container.appendChild(messageContainer);
    chatContainer === null || chatContainer === void 0 ? void 0 : chatContainer.appendChild(container);
});
const chatForm = document.querySelector("#chat-container form");
const chatInput = document.querySelector("#chat-container input");
chatForm === null || chatForm === void 0 ? void 0 : chatForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = chatInput === null || chatInput === void 0 ? void 0 : chatInput.value;
    if (!message) {
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
    }).catch((error) => {
        console.error("Error sending message:", error);
    });
});
// socket.on("test-event", (data: any) => { 
//     console.log("Received test-event:", data);
// })
