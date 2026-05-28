import { z } from 'zod';

export const movieSchema = z.object({
  title: z.string().min(1),
  genres: z.array(z.string().toLowerCase()),
  year: z.number().int().min(1888).optional(),
  rating: z.number().min(0).max(10),
  original_language: z.string().optional()
});

export const movieArraySchema = z.array(movieSchema);

export type Movie = z.infer<typeof movieSchema>;