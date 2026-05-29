import { test } from 'node:test';
import assert from 'node:assert/strict';
import { envSchema } from '../config/env.schema';

test('env schema valida variables requeridas', () => {
  const result = envSchema.safeParse({
    DATABASE_URL: 'mongodb://localhost:27017/cineclub',
    OPENAI_API_KEY: 'sk-test',
    TMDB_API_KEY: 'tmdb-test',
    TMDB_BASE_URL: 'https://api.themoviedb.org/3'
  });

  assert.equal(result.success, true);
});

test('env schema falla cuando faltan secrets', () => {
  const result = envSchema.safeParse({});
  assert.equal(result.success, false);
});
