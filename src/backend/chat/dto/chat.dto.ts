import { z } from 'zod';

export const chatMessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().min(1)
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
