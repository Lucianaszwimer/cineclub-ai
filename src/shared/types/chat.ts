import { Movie } from './movie';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  movies?: Movie[];
}

export interface ChatSessionSummary {
  id: string;
  title: string;
  updatedAt: string;
  customTitle?: string;
}
