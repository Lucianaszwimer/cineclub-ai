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
      const genrePromises = filters.genres
        .split(',')
        .map((g) => this.getTmdbGenreId(g.trim()));

      const genreResults = await Promise.all(genrePromises);
      const genreIds = genreResults.filter((v): v is number => v !== null);

      if (genreIds.length > 0) {
        queryParams.with_genres = genreIds.join(',');
      }
    }

    if (filters.rating) {
      queryParams['vote_average.gte'] = filters.rating;
    }

    if(filters.original_language) {
      if(filters.original_language.length !== 2) {
        const response = await axios.get(`${this.baseUrl}/configuration/languages`, { params: { api_key: this.apiKey, language: 'es-ES' } });
        //TODO: tengo que traducir filter.original_language a ingles para que se pueda buscar en español
        const language = response.data.find((lang: { english_name: string }) => lang.english_name.toLowerCase() === filters.original_language!.toLowerCase());
        if (language) {
          queryParams.with_original_language = language.iso_639_1;
        } else {
          console.warn(`Idioma no encontrado en TMDB: ${filters.original_language}`);
        }        
      }else{
      queryParams.with_original_language = filters.original_language;
      }
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

      const mappedMovies = await Promise.all(tmdbResults.map(async (movie: TMDBMovie) => {
        let finalGenres: string[] = [];

        if (filters.genres) {
          finalGenres = filters.genres.split(',').map((g) => g.trim().toLowerCase());
        } else if (movie.genre_ids && movie.genre_ids.length > 0) {
          const genrePromises = movie.genre_ids.map((id) => this.getGenreNameFromId(id));
          const genreResults = await Promise.all(genrePromises);
          finalGenres = genreResults.filter((v): v is string => v !== null);
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
      }));

      return movieArraySchema.parse(mappedMovies);

    } catch (error) {
      console.error("Error en repositorio de TMDB API con Axios:", error);
      return [];
    }
  }

  async getTmdbGenreId(genreName: string): Promise<number | null> {
    const response = await axios.get(`${this.baseUrl}/genre/movie/list`, { params: { api_key: this.apiKey, language: 'es-ES' } });
    const genre = response.data.genres.find((g: { name: string }) => g.name.toLowerCase() === genreName.toLowerCase());
    return genre ? genre.id : null;
  }

  async getGenreNameFromId(id: number): Promise<string | null> {
    const response = await axios.get(`${this.baseUrl}/genre/movie/list`, { params: { api_key: this.apiKey, language: 'es-ES' } });
    const genre = response.data.genres.find((g: { id: number }) => g.id === id);
    return genre ? genre.name : null;
  }
}