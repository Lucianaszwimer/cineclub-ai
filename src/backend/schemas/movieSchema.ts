import { z } from 'zod';

export const movieSchema = z.object({
  title: z.string().min(1),
  genres: z.array(z.string().toLowerCase()),
  year: z.number().int().min(1888),
  rating: z.number().min(0).max(10),
});

export const movieArraySchema = z.array(movieSchema);

export type Movie = z.infer<typeof movieSchema>;