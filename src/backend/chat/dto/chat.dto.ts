import { z } from 'zod';
import type { Movie } from '../interfaces/chat.types';

const movieSchema: z.ZodType<Movie> = z.object({
  title: z.string().min(1),
  genres: z.array(z.string()),
  year: z.number().int().min(1888).optional(),
  rating: z.number().min(0).max(10),
  original_language: z.string().optional()
});

export const chatMessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().min(1),
  movies: z.array(movieSchema).optional(),
  createdAt: z.coerce.date().optional()
});

export const postChatSchema = z.object({
  sessionId: z.string().min(1).optional(),
  messages: z.array(chatMessageSchema).min(1)
});

export const getSessionParamsSchema = z.object({
  id: z.string().min(1)
});

export type PostChatDto = z.infer<typeof postChatSchema>;
export type GetSessionParamsDto = z.infer<typeof getSessionParamsSchema>;
