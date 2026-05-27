import { z } from 'zod';

export const intentAnalysisSchema = z.object({
  intent: z.enum(['search_movies', 'general_chat']),
  confidence: z.number().min(0).max(1),
  extractedParameters: z.object({
    title: z.string().optional(),
    genres: z.array(z.string()).optional(),
    year: z.number().optional(),
    rating: z.number().optional(),
  }),
  explanation: z.string(),
});

export type IntentAnalysis = z.infer<typeof intentAnalysisSchema>;