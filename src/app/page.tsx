"use client"; 

import React, { useState } from 'react';
import ChatWindow from './components/chatWindow/ChatWindow';
import Header from './components/header/Header';
import { Movie } from '../shared/types/movie';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  movies?: Movie[];
}

export default function ChatPage() {
  const [sessionId, setSessionId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSessionLoaded = (id: string, pastMessages: Message[]) => {
    setSessionId(id);
    setMessages(pastMessages);
  };

  return (
    <div className="min-h-screen bg-transparent text-zinc-100 flex flex-col">
      {/* Le pasamos la función de carga al Header */}
      <Header onSessionLoaded={handleSessionLoaded} />
      
      <main className="flex-1 flex items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-2xl">
          {/* Le pasamos el estado actual y sus seters al ChatWindow 
            para que comparta la misma información en tiempo real
          */}
          <ChatWindow 
            sessionId={sessionId} 
            setSessionId={setSessionId}
            messages={messages}
            setMessages={setMessages}
          />
        </div>
      </main>
    </div>
  );
}