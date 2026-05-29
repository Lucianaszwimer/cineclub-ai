import { Injectable } from '@nestjs/common';
import { Movie } from '../../chat/interfaces/chat.types';
import { TmdbMovieResult } from '../interfaces/tmdb.types';

@Injectable()
export class TmdbMovieAdapter {
  toDomainMovie(movie: TmdbMovieResult, fallbackGenres: string[]): Movie {
    return {
      title: movie.title || movie.original_title || 'Sin título',
      genres: fallbackGenres.length ? fallbackGenres : ['general'],
      year: movie.release_date ? parseInt(movie.release_date.split('-')[0], 10) : undefined,
      rating: movie.vote_average || 0,
      original_language: movie.original_language || undefined
    };
  }
}
