import React, { useState } from 'react';
import { ChatMessage } from '../../../shared/types/chat';
import { apiUrl } from '../../lib/api';

interface HeaderProps {
  onSessionLoaded: (id: string, messages: ChatMessage[]) => void;
}

function getErrorMessage(payload: unknown, fallback: string): string {
  if (typeof payload === 'string') return payload;
  if (payload && typeof payload === 'object') {
    const candidate = payload as { message?: unknown; error?: unknown };
    if (typeof candidate.message === 'string') return candidate.message;
    if (typeof candidate.error === 'string') return candidate.error;
    if (candidate.message && typeof candidate.message === 'object') {
      const nested = candidate.message as { message?: unknown; error?: unknown };
      if (typeof nested.message === 'string') return nested.message;
      if (typeof nested.error === 'string') return nested.error;
    }
  }

  return fallback;
}

export default function Header({ onSessionLoaded }: HeaderProps) {
  const [searchId, setSearchId] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearchSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(apiUrl(`/chat/${searchId.trim()}`));
      const data = await response.json();

      if (!response.ok) {
        setError(getErrorMessage(data, `ID de sesión no válido (HTTP ${response.status})`));
        return;
      }

      onSessionLoaded(data.sessionId, data.messages);
      setSearchId('');
    } catch {
      setError('Error al conectar con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="bg-zinc-900/90 border-b border-zinc-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md">
      <div className="font-bold text-lg tracking-wider bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
        🎬 CINECLUB AI
      </div>

      <div className="flex flex-col items-end relative">
        <form onSubmit={handleSearchSession} className="flex items-center gap-2">
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            disabled={isLoading}
            placeholder="Buscar ID de chat anterior..."
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors w-44 md:w-64"
          />
          <button
            type="submit"
            disabled={isLoading || !searchId.trim()}
            className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 font-medium rounded-lg px-3 py-1.5 text-xs transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Cargando...' : 'Retomar'}
          </button>
        </form>

        {error && (
          <span className="text-[10px] text-red-400 absolute top-9 right-1 bg-zinc-950/90 border border-red-500/30 px-2 py-0.5 rounded shadow-md">
            ⚠️ {error}
          </span>
        )}
      </div>

      <nav className="flex gap-4 text-sm text-zinc-400">
        <a
          href="https://www.cinemark.com.ar/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-zinc-200 transition-colors"
        >
          Cartelera de cines
        </a>
      </nav>
    </header>
  );
}
