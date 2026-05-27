import { test } from 'node:test';
import assert from 'node:assert';
import { fetchMoviesFromTMDB } from '../../backend/services/tmdbService';

const misPelículasLocales = [
    { title: "Batman", genres: ["accion"], year: 2022, rating: 7.8 },
    { title: "Toy Story", genres: ["animacion"], year: 1995, rating: 8.3 },
    { title: "When Harry Met Sally", genres: ["romance"], year: 1989, rating: 7.6 },
    { title: "Back to the Future", genres: ["ciencia ficcion"], year: 1985, rating: 8.5 },
    { title: "Ratatouille", genres: ["animacion"], year: 2007, rating: 8.0 }
  ];

test('Debería retornar películas filtradas por título', async () => {
  const resultado = await fetchMoviesFromTMDB({ title: 'Batman' }, misPelículasLocales);
  assert.strictEqual(resultado.length, 1);
  assert.strictEqual(resultado[0].title, "Batman");
});

test('Debería retornar películas filtradas por género', async () => {
  const resultado = await fetchMoviesFromTMDB({ genres: 'animacion' }, misPelículasLocales);
  assert.strictEqual(resultado.length, 2);
  assert.strictEqual(resultado[0].title, "Toy Story");
  assert.strictEqual(resultado[1].title, "Ratatouille");
});

test('Debería retornar películas filtradas por año', async () => {
  const resultado = await fetchMoviesFromTMDB({ year: 1985 }, misPelículasLocales);
  assert.strictEqual(resultado.length, 1);
  assert.strictEqual(resultado[0].title, "Back to the Future");
});

test('Debería retornar películas filtradas por rating', async () => {
  const resultado = await fetchMoviesFromTMDB({ rating: 8.0 }, misPelículasLocales);
  assert.strictEqual(resultado.length, 3);
  assert.strictEqual(resultado[0].title, "Toy Story");
  assert.strictEqual(resultado[1].title, "Back to the Future");
  assert.strictEqual(resultado[2].title, "Ratatouille");
});