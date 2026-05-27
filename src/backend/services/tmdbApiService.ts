import axios from 'axios';
import { IMovieRepository, MovieFilters } from '../interfaces/movieInterface';
import { movieArraySchema } from '../schemas/movieSchema';
import { Movie } from '../schemas/movieSchema';

export class TmdbApiService implements IMovieRepository {
  private apiKey = process.env.TMDB_API_KEY;
  private baseUrl = process.env.TMDB_BASE_URL;

  async fetchMovies(filters: MovieFilters): Promise<Movie[]> {
    let endpoint = `${this.baseUrl}/discover/movie`;
    
    const queryParams: Record<string, string | number | boolean | undefined> = {
      api_key: this.apiKey,
      language: 'es-ES'
    };

    if (filters.title) {
      endpoint = `${this.baseUrl}/search/movie`;
      queryParams.query = filters.title;
    }
    
    if (filters.year) {
      queryParams.primary_release_year = filters.year;
    }

    if (filters.genres) {
      const genreIds = filters.genres
        .split(',')
        .map((g) => this.getTmdbGenreId(g.trim()))
        .filter((v): v is number => !!v);
      
      if (genreIds.length > 0) {
        queryParams.with_genres = genreIds.join(',');
      }
    }

    if (filters.rating) {
      queryParams['vote_average.gte'] = filters.rating;
    }

    if(filters.original_language) {
      queryParams.with_original_language = filters.original_language;
    }

    try {
      const response = await axios.get(endpoint, { params: queryParams });

      type TMDBMovie = {
        title?: string;
        original_title?: string;
        release_date?: string;
        vote_average?: number;
        genre_ids?: number[];
        original_language?: string;
      };

      const tmdbResults = (response.data.results || []) as TMDBMovie[];

      const mappedMovies = tmdbResults.map((movie: TMDBMovie) => {
        let finalGenres: string[] = [];

        if (filters.genres) {
          finalGenres = filters.genres.split(',').map((g) => g.trim().toLowerCase());
        } else if (movie.genre_ids && movie.genre_ids.length > 0) {
          finalGenres = movie.genre_ids
            .map((id) => this.getGenreNameFromId(id))
            .filter((v): v is string => !!v);
        }

        if (finalGenres.length === 0) {
          finalGenres = ["general"];
        }

        return {
          title: movie.title || movie.original_title,
          genres: finalGenres, 
          year: movie.release_date ? parseInt(movie.release_date.split('-')[0], 10) : 2026,
          rating: movie.vote_average || 0,
          original_language: movie.original_language || undefined
        };
      });

      return movieArraySchema.parse(mappedMovies);

    } catch (error) {
      console.error("Error en repositorio de TMDB API con Axios:", error);
      return [];
    }
  }

  private getTmdbGenreId(genreName: string): number | null {
    const genres: { [key: string]: number } = {
      'accion': 28,
      'ciencia ficcion': 878,
      'drama': 18,
      'comedia': 35,
      'terror': 27,
      'romance': 10749,
      'animacion': 16
    };
    return genres[genreName.toLowerCase().trim()] || null;
  }

  private getGenreNameFromId(id: number): string | null {
    const genreIds: { [key: number]: string } = {
      28: 'accion',
      878: 'ciencia ficcion',
      18: 'drama',
      35: 'comedia',
      27: 'terror',
      10749: 'romance',
      16: 'animacion'
    };
    return genreIds[id] || null;
  }
}