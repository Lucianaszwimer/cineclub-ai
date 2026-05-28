import { Movie } from '../schemas/movieSchema';

export interface IChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  movies?: Movie[]; // Aquí puedes definir mejor el tipo según tu MovieCard
  createdAt?: Date;
}

export interface IChatSession {
  sessionId: string;
  messages: IChatMessage[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IChatRepository {
  
  findSessionById(sessionId: string): Promise<IChatSession | null>;
  
  createSession(sessionId: string, initialMessage: IChatMessage): Promise<IChatSession>;

  addMessageToSession(sessionId: string, message: IChatMessage): Promise<IChatSession | null>;

  saveOrUpdateSession(sessionId: string, messages: IChatMessage[]): Promise<IChatSession>;
}