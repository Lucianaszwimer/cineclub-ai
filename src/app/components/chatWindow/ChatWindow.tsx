"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MovieCard } from '../../components/movieCard/MovieCard';
import { Movie } from '../../../backend/schemas/movieSchema';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  movies?: Movie[];
}

interface ChatWindowProps {
  sessionId: string;
  setSessionId: React.Dispatch<React.SetStateAction<string>>;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export default function ChatWindow({ sessionId, setSessionId, messages, setMessages }: ChatWindowProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { //auto scroll
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage]; 
    
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          sessionId: sessionId || undefined 
        })
      });

      const data = await response.json();

      if (response.ok) {
        if (data.sessionId) {
          setSessionId(data.sessionId);
        }
        
        setMessages((prev) => [...prev, data.message]);
      }
      } catch (error) {
        console.error("Error al enviar mensaje:", error);
      } finally {
        setIsLoading(false);
      }
    };

  return (
    <div className="flex flex-col h-[clamp(34rem,78dvh,50rem)] w-full border border-zinc-800 rounded-xl bg-zinc-950/80 shadow-2xl overflow-hidden backdrop-blur-sm min-h-0">
      
      {/* Encabezado interno del chat */}
      <div className="bg-zinc-900/50 border-b border-zinc-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🍿</span>
          <div>
            <h1 className="text-md font-bold text-zinc-100">Cineclub AI</h1>
            <p className="text-xs text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
              Asistente cinéfilo online
            </p>
          </div>
        </div>
        {sessionId && (
          <span className="text-[10px] text-zinc-500 font-mono bg-zinc-950 px-2 py-1 rounded border border-zinc-800">
            ID: {sessionId}
          </span>
        )}
      </div>

      {/* Cuerpo del Chat / Mensajes */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-zinc-950/40 to-zinc-900/40">
        {messages.length === 0 && (
          <div className="text-center py-12 px-4 text-zinc-500 space-y-2">
            <p className="text-lg font-medium text-zinc-400">¡Hola! Te doy la bienvenida al Cineclub. 🎉</p>
            <p className="text-sm max-w-sm mx-auto">Podés pedirme recomendaciones diciendo cosas como: &quot;Quiero ver una comedia de 1985&quot;.</p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div key={index} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} space-y-2`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap break-words shadow-md ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : 'bg-zinc-800 text-zinc-100 rounded-bl-none border border-zinc-700'
              }`}
            >
              {msg.content}
            </div>

            {msg.movies && msg.movies.length > 0 && (
              <div className="w-full max-w-[90%] grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {msg.movies.map((movie, movieIdx) => (
                  <MovieCard key={movieIdx} movie={movie} />
                ))}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-zinc-800 border border-zinc-700 text-zinc-400 rounded-2xl rounded-bl-none px-4 py-3 text-sm flex items-center gap-1 shadow-md">
              <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Formulario de Entrada */}
      <form onSubmit={handleSendMessage} className="p-3 bg-zinc-900/50 border-t border-zinc-800 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribí tu mensaje o pedí un ciclo de cine..."
          className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg px-4 py-2 text-sm transition-colors disabled:opacity-50"
          disabled={isLoading || !input.trim()}
        >
          Enviar
        </button>
      </form>
    </div>
  );
}