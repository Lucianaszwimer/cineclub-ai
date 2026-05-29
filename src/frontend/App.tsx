import React, { useMemo, useState } from 'react';
import ChatWindow from './components/chatWindow/ChatWindow';
import Header from './components/header/Header';
import Sidebar from './components/sidebar/Sidebar';
import { ChatMessage, ChatSessionSummary } from '../shared/types/chat';
import { apiUrl } from './lib/api';

const STORAGE_KEY = 'cineclub_chat_sessions';
const MAX_STORED_SESSIONS = 40;

function buildSessionTitle(messages: ChatMessage[]): string {
  const firstUserMessage = messages.find((message) => message.role === 'user');
  if (!firstUserMessage?.content) return 'Chat sin título';
  return firstUserMessage.content.slice(0, 60);
}

function parseStoredSessions(raw: string | null): ChatSessionSummary[] {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as ChatSessionSummary[];
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item) => item && typeof item.id === 'string' && typeof item.title === 'string' && typeof item.updatedAt === 'string')
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  } catch {
    return [];
  }
}

function getInitialSessions(): ChatSessionSummary[] {
  if (typeof window === 'undefined') return [];
  return parseStoredSessions(window.localStorage.getItem(STORAGE_KEY));
}

export default function App() {
  const [sessionId, setSessionId] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessions, setSessions] = useState<ChatSessionSummary[]>(getInitialSessions);
  const [isLoadingSession, setIsLoadingSession] = useState(false);

  const persistSessions = (next: ChatSessionSummary[]) => {
    setSessions(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const persistSessionSummary = (id: string, sessionMessages: ChatMessage[]) => {
    if (!id || sessionMessages.length === 0) return;

    const current = sessions.find((item) => item.id === id);
    const summary: ChatSessionSummary = {
      id,
      title: buildSessionTitle(sessionMessages),
      updatedAt: new Date().toISOString(),
      customTitle: current?.customTitle
    };

    const deduped = sessions.filter((item) => item.id !== id);
    persistSessions([summary, ...deduped].slice(0, MAX_STORED_SESSIONS));
  };

  const handleDeleteSession = (id: string) => {
    const filtered = sessions.filter((item) => item.id !== id);
    persistSessions(filtered);

    if (sessionId === id) {
      setSessionId('');
      setMessages([]);
    }
  };

  const handleClearSessions = () => {
    persistSessions([]);
    if (sessionId) {
      setSessionId('');
      setMessages([]);
    }
  };

  const handleRenameSession = (id: string, nextTitle: string) => {
    const next = sessions.map((session) =>
      session.id === id ? { ...session, customTitle: nextTitle, updatedAt: new Date().toISOString() } : session
    );
    persistSessions(next);
  };

  const handleSessionLoaded = (id: string, pastMessages: ChatMessage[]) => {
    setSessionId(id);
    setMessages(pastMessages);
    persistSessionSummary(id, pastMessages);
  };

  const handleSelectSessionFromSidebar = async (id: string) => {
    if (!id || isLoadingSession) return;

    setIsLoadingSession(true);
    try {
      const response = await fetch(apiUrl(`/chat/${id}`));
      const data = await response.json();
      if (!response.ok) return;

      setSessionId(data.sessionId);
      setMessages(data.messages);
      persistSessionSummary(data.sessionId, data.messages);
    } finally {
      setIsLoadingSession(false);
    }
  };

  const handleNewChat = () => {
    setSessionId('');
    setMessages([]);
  };

  const sortedSessions = useMemo(
    () => [...sessions].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    [sessions]
  );

  return (
    <div className="min-h-screen bg-transparent text-zinc-100 flex flex-col">
      <Header onSessionLoaded={handleSessionLoaded} />

      <main className="flex-1 p-4 md:p-6">
        <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-4 md:gap-6 items-start">
          <Sidebar
            sessions={sortedSessions}
            activeSessionId={sessionId}
            onSelectSession={handleSelectSessionFromSidebar}
            onNewChat={handleNewChat}
            onDeleteSession={handleDeleteSession}
            onClearSessions={handleClearSessions}
            onRenameSession={handleRenameSession}
            isLoading={isLoadingSession}
          />

          <div className="flex-1 w-full max-w-3xl">
            <ChatWindow
              sessionId={sessionId}
              setSessionId={setSessionId}
              messages={messages}
              setMessages={setMessages}
              onSessionPersist={persistSessionSummary}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
