import React, { useMemo, useState } from 'react';
import { ChatSessionSummary } from '../../../shared/types/chat';

interface SidebarProps {
  sessions: ChatSessionSummary[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
  onClearSessions: () => void;
  onRenameSession: (id: string, nextTitle: string) => void;
  isLoading: boolean;
}

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return Number.isNaN(date.getTime()) ? 'Sin fecha' : date.toLocaleString();
}

export default function Sidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onClearSessions,
  onRenameSession,
  isLoading
}: SidebarProps) {
  const [editingId, setEditingId] = useState<string>('');
  const [draftTitle, setDraftTitle] = useState('');
  const [copiedId, setCopiedId] = useState<string>('');

  const canClear = useMemo(() => sessions.length > 0, [sessions.length]);

  const startRename = (session: ChatSessionSummary) => {
    setEditingId(session.id);
    setDraftTitle(session.customTitle || session.title);
  };

  const confirmRename = (id: string) => {
    const title = draftTitle.trim();
    if (!title) {
      setEditingId('');
      setDraftTitle('');
      return;
    }

    onRenameSession(id, title);
    setEditingId('');
    setDraftTitle('');
  };

  const handleCopyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopiedId(id);
      window.setTimeout(() => {
        setCopiedId((current) => (current === id ? '' : current));
      }, 1200);
    } catch {
      setCopiedId('');
    }
  };

  return (
    <aside className="w-full md:w-80 md:min-w-80 md:max-w-80 bg-zinc-900/80 border border-zinc-800 rounded-xl shadow-xl backdrop-blur-sm p-3 flex flex-col gap-3 h-[clamp(20rem,78dvh,50rem)]">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-zinc-100">Historial de chats</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClearSessions}
            disabled={!canClear}
            className="text-[11px] px-2 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors disabled:opacity-50"
          >
            Vaciar
          </button>
          <button
            type="button"
            onClick={onNewChat}
            className="text-xs px-2 py-1 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
          >
            Nuevo
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1">
        {sessions.length === 0 && <p className="text-xs text-zinc-500">Todavía no hay chats guardados en este navegador.</p>}

        {sessions.map((session) => {
          const isActive = session.id === activeSessionId;
          const isEditing = editingId === session.id;
          const displayTitle = session.customTitle || session.title;

          return (
            <div
              key={session.id}
              className={`w-full rounded-lg border px-3 py-2 transition-colors ${
                isActive
                  ? 'bg-indigo-500/20 border-indigo-500/50 text-zinc-100'
                  : 'bg-zinc-950/70 border-zinc-800 text-zinc-300'
              }`}
            >
              <button
                type="button"
                onClick={() => onSelectSession(session.id)}
                disabled={isLoading}
                className="w-full text-left"
              >
                {!isEditing && <p className="text-xs font-medium truncate">{displayTitle}</p>}
                {isEditing && (
                  <input
                    value={draftTitle}
                    onChange={(event) => setDraftTitle(event.target.value)}
                    onBlur={() => confirmRename(session.id)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') confirmRename(session.id);
                      if (event.key === 'Escape') {
                        setEditingId('');
                        setDraftTitle('');
                      }
                    }}
                    className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 text-xs rounded px-2 py-1"
                    autoFocus
                  />
                )}
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-[10px] text-zinc-500 truncate">{session.id}</p>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      void handleCopyId(session.id);
                    }}
                    aria-label="Copiar ID de sesión"
                    title="Copiar ID"
                    className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                  >
                    {copiedId === session.id ? 'Copiado' : '📋'}
                  </button>
                </div>
                <p className="text-[10px] text-zinc-500 mt-1">{formatDate(session.updatedAt)}</p>
              </button>

              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => startRename(session)}
                  className="text-[10px] px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                >
                  Renombrar
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteSession(session.id)}
                  className="text-[10px] px-2 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-300"
                >
                  Eliminar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
