import React, { useEffect, useRef, useState, Suspense } from 'react';
import { sendChatMessage, onChatMessage } from '../sockets';

interface ChatMessage {
  user: { id: string; email: string; gravatar?: string };
  message: string;
  timestamp: number;
}

export default function Chat({ lobbyId }: { lobbyId: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (msg: ChatMessage) => setMessages((prev) => [...prev, msg]);
    onChatMessage(handler);
    return () => {
      // Remove listener if needed
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={{ border: '1px solid #ccc', padding: 8, borderRadius: 4, maxWidth: 400 }}>
      <div style={{ maxHeight: 200, overflowY: 'auto', marginBottom: 8 }}>
        {messages.map((msg, idx) => (
          <div key={idx}>
            <b>{msg.user.email}:</b> {msg.message}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={e => {
          e.preventDefault();
          if (input.trim()) {
            sendChatMessage(lobbyId, input);
            setInput('');
          }
        }}
        style={{ display: 'flex', gap: 4 }}
      >
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          style={{ flex: 1 }}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
