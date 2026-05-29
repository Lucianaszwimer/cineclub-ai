import { Inject, Injectable } from '@nestjs/common';
import { z } from 'zod';
import { Movie } from '../../chat/interfaces/chat.types';
import { MovieFilters } from '../interfaces/movie-filters';
import { TmdbMovieAdapter } from '../adapters/tmdb-movie.adapter';
import { TmdbApiRepository } from '../repositories/tmdb-api.repository';

const movieSchema = z.object({
  title: z.string().min(1),
  genres: z.array(z.string()),
  year: z.number().int().min(1888).optional(),
  rating: z.number().min(0).max(10),
  original_language: z.string().optional()
});

const movieArraySchema = z.array(movieSchema);

@Injectable()
export class MovieSearchService {
  private readonly genreNameToIdMap: Map<string, number> = new Map();
  private readonly genreIdToNameMap: Map<number, string> = new Map();
  private readonly languageNameToIsoMap: Map<string, string> = new Map();
  private isCacheLoaded = false;

  private readonly spanishToEnglishLanguageMap: Record<string, string> = {
    espanol: 'spanish',
    castellano: 'spanish',
    ingles: 'english',
    frances: 'french',
    italiano: 'italian',
    aleman: 'german',
    japones: 'japanese',
    coreano: 'korean',
    portugues: 'portuguese',
    chino: 'chinese',
    ruso: 'russian',
    hebreo: 'hebrew'
  };

  constructor(
    @Inject(TmdbApiRepository) private readonly tmdbRepository: TmdbApiRepository,
    @Inject(TmdbMovieAdapter) private readonly tmdbMovieAdapter: TmdbMovieAdapter
  ) {}

  private cleanText(str: string): string {
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  }

  private async ensureCache(): Promise<void> {
    if (this.isCacheLoaded) return;

    const [genres, languages] = await Promise.all([
      this.tmdbRepository.fetchGenres(),
      this.tmdbRepository.fetchLanguages()
    ]);

    genres.forEach((genre) => {
      const cleanName = this.cleanText(genre.name);
      this.genreNameToIdMap.set(cleanName, genre.id);
      this.genreIdToNameMap.set(genre.id, cleanName);
    });

    languages.forEach((language) => {
      this.languageNameToIsoMap.set(this.cleanText(language.english_name), language.iso_639_1);
    });

    this.isCacheLoaded = true;
  }

  private resolveLanguageFilter(language?: string): string | undefined {
    if (!language) return undefined;

    const cleanInput = this.cleanText(language);
    if (cleanInput.length === 2) return cleanInput;

    const englishName = this.spanishToEnglishLanguageMap[cleanInput] || cleanInput;
    return this.languageNameToIsoMap.get(englishName);
  }

  async fetchMovies(filters: MovieFilters): Promise<Movie[]> {
    await this.ensureCache();

    const queryParams: Record<string, string | number | undefined> = {};
    let endpoint: 'search' | 'discover' = 'discover';

    if (filters.title) {
      endpoint = 'search';
      queryParams.query = filters.title;
    }

    if (filters.year) queryParams.primary_release_year = filters.year;
    if (filters.rating !== undefined) queryParams['vote_average.gte'] = filters.rating;

    if (filters.genres) {
      const genreIds = filters.genres
        .split(',')
        .map((genre) => this.genreNameToIdMap.get(this.cleanText(genre)))
        .filter((value): value is number => !!value);

      if (genreIds.length > 0) {
        queryParams.with_genres = genreIds.join(',');
      }
    }

    const language = this.resolveLanguageFilter(filters.original_language);
    if (language) queryParams.with_original_language = language;

    const rawMovies = await this.tmdbRepository.searchOrDiscover(endpoint, queryParams);

    const requestedGenres = filters.genres?.split(',').map((genre) => genre.trim().toLowerCase()) || [];

    let movies = rawMovies.map((movie) => {
      const resolvedGenres = requestedGenres.length
        ? requestedGenres
        : (movie.genre_ids || [])
            .map((id) => this.genreIdToNameMap.get(id))
            .filter((value): value is string => !!value);

      return this.tmdbMovieAdapter.toDomainMovie(movie, resolvedGenres);
    });

    if (filters.sort === 'best') {
      movies = [...movies].sort((a, b) => b.rating - a.rating);
    }

    if (filters.sort === 'worst') {
      movies = [...movies].sort((a, b) => a.rating - b.rating);
    }

    if (filters.limit && filters.limit > 0) {
      movies = movies.slice(0, filters.limit);
    }

    return movieArraySchema.parse(movies);
  }
}
