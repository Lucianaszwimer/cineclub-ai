import { Movie } from '../schemas/movieSchema';

export interface MovieFilters {
  title?: string;
  genres?: string;
  year?: number;
  rating?: number;
}

export interface IMovieRepository {
  fetchMovies(filters: MovieFilters): Promise<Movie[]>;
}