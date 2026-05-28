import { z } from 'zod';

export const intentAnalysisSchema = z.object({
  intent: z.enum(['search_movies', 'general_chat']),
  confidence: z.number().min(0).max(1),
  extractedParameters: z.object({
    title: z.string().optional(),
    genres: z.array(z.string()).optional(),
    year: z.number().optional(),
    rating: z.number().optional(),
    original_language: z.string().optional(),
    limit: z.number().int().positive().optional(),
    sort: z.enum(['worst', 'best']).optional()
  }),
  explanation: z.string(),
});

export type IntentAnalysis = z.infer<typeof intentAnalysisSchema>;