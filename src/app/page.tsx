import React from 'react';
import ChatWindow from './components/chatWindow/ChatWindow';
import Header from './components/header/Header';
import BarraLateral from './components/barraLateral/BarraLateral';

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* barra lateral para el historial de mensajes (a futuro) */}
        <BarraLateral />

        <div className="lg:col-span-3 flex flex-col justify-center">
          <ChatWindow />
        </div>

      </main>
    </div>
  );
}