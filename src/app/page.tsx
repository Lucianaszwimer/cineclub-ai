import React from 'react';
import ChatWindow from './components/chatWindow/ChatWindow';

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <header className="w-full bg-zinc-900/50 border-b border-zinc-800 p-4 flex items-center justify-between">
        <div className="font-bold text-lg tracking-wider bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          🎬 CINECLUB AI
        </div>
        <nav className="flex gap-4 text-sm text-zinc-400">
          <a href="#" className="hover:text-zinc-200 transition-colors">Mis Ciclos</a>
          <a href="https://www.cinemark.com.ar/" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-200 transition-colors">Cartelera</a>
        </nav>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* barra lateral para el historial de mensajes (a futuro) */}
        <div className="hidden lg:block lg:col-span-1 bg-zinc-900/30 border border-zinc-800 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-zinc-400 mb-3">Tus Conversaciones</h2>
          <div className="space-y-2">
            <div className="p-2.5 bg-zinc-900 rounded-lg text-xs font-medium border border-zinc-800 text-indigo-400 cursor-pointer">
              🍿 Ciclo de Comedias 80s
            </div>
            <div className="p-2.5 hover:bg-zinc-900 rounded-lg text-xs font-medium text-zinc-500 cursor-pointer transition-colors">
              🎃 Noche de Terror Clásico
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 flex flex-col justify-center">
          <ChatWindow />
        </div>

      </main>
    </div>
  );
}