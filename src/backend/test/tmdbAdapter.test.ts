import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TmdbMovieAdapter } from '../tmdb/adapters/tmdb-movie.adapter';

const adapter = new TmdbMovieAdapter();

test('mapea pelicula TMDB a entidad de dominio', () => {
  const movie = adapter.toDomainMovie(
    {
      title: 'Inception',
      release_date: '2010-07-16',
      vote_average: 8.8,
      original_language: 'en'
    },
    ['ciencia ficcion']
  );

  assert.equal(movie.title, 'Inception');
  assert.equal(movie.year, 2010);
  assert.equal(movie.rating, 8.8);
  assert.deepEqual(movie.genres, ['ciencia ficcion']);
});
