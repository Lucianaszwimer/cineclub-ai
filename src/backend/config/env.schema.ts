import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  NEST_PORT: z.coerce.number().int().positive().default(3001),
  NEST_BASE_URL: z.string().url().optional(),
  DATABASE_URL: z.string().min(1),
  OPENAI_API_KEY: z.string().min(1),
  TMDB_API_KEY: z.string().min(1),
  TMDB_BASE_URL: z.string().url().default('https://api.themoviedb.org/3'),
  INTERNAL_API_KEY: z.string().min(1).optional()
});

export type Env = z.infer<typeof envSchema>;
