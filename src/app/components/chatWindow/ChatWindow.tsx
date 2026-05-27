'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll automático al final cada vez que llega un mensaje nuevo
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    
    // Actualizamos la pantalla inmediatamente con el mensaje del usuario
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Mandamos el mensaje a tu API route de Next.js
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage], // Enviamos el historial + el nuevo mensaje
          sessionId: sessionId // Enviamos el ID de sesión si ya existe
        }),
      });

      const data = await response.json();

      if (data.sessionId) {
        setSessionId(data.sessionId); // Guardamos el ID de Mongo para el próximo mensaje
      }

      if (data.message) {
        setMessages((prev) => [...prev, data.message]);
      }
    } catch (error) {
      console.error("Error conectando con el backend:", error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '❌ Uy, se me cortó la cinta. Hubo un problema de conexión con el servidor.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[85vh] max-w-2xl mx-auto border border-zinc-800 rounded-xl bg-zinc-950 shadow-2xl overflow-hidden">
      {/* Encabezado */}
      <div className="bg-zinc-900 border-b border-zinc-800 p-4 flex items-center justify-between">
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
          <span className="text-[10px] text-zinc-500 font-mono">ID: {sessionId.slice(-6)}</span>
        )}
      </div>

      {/* Cuerpo del Chat / Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-zinc-950 to-zinc-900">
        {messages.length === 0 && (
          <div className="text-center py-12 px-4 text-zinc-500 space-y-2">
            <p className="text-lg font-medium text-zinc-400">¡Hola! Te doy la bienvenida al Cineclub. 🎉</p>
            <p className="text-sm max-w-sm mx-auto">Podés pedirme recomendaciones diciendo cosas como: *&quot;Quiero ver una comedia de 1985&quot;* o charlar de directores libres.</p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap shadow-md ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : 'bg-zinc-800 text-zinc-100 rounded-bl-none border border-zinc-700'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* Indicador de que el Bot está pensando */}
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
      <form onSubmit={handleSendMessage} className="p-3 bg-zinc-900 border-t border-zinc-800 flex gap-2">
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