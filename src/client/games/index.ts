import React, { useState, Suspense } from 'react';

const Chat = React.lazy(() => import('./Chat'));

export default function GamesPage() {
  const [showChat, setShowChat] = useState(false);
  const lobbyId = 'example-lobby-id'; // Replace with actual lobby ID from your state/context

  return (
    <div>
      <h1>Crazy 8s Online Lobby</h1>
      <button onClick={() => setShowChat((s) => !s)}>
        {showChat ? 'Hide' : 'Show'} Chat
      </button>
      {showChat && (
        <Suspense fallback={<div>Loading chat...</div>}>
          <Chat lobbyId={lobbyId} />
        </Suspense>
      )}
      {/* ...other game UI... */}
    </div>
  );
}