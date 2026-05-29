export type ChatRole = 'user' | 'assistant' | 'system';

export interface Movie {
  title: string;
  genres: string[];
  year?: number;
  rating: number;
  original_language?: string;
}

export interface ChatMessage {
  role: ChatRole;
  content: string;
  movies?: Movie[];
  createdAt?: Date;
}

export interface ChatSession {
  sessionId: string;
  messages: ChatMessage[];
  createdAt?: Date;
  updatedAt?: Date;
}
