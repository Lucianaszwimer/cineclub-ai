import { TmdbApiService } from './tmdbApiService';
import { TmdbLocalService } from './tmdbLocalService';
import { MovieFilters } from '../interfaces/movieInterface';
import { Movie } from '../schemas/movieSchema';

export async function fetchMoviesFromTMDB(filters: MovieFilters, mockData?: Movie[]) {
  const useLocal = 
    mockData !== undefined || 
    process.env.NODE_ENV === 'test' || 
    process.env.USE_LOCAL_MOVIES === 'true';

  const repository = useLocal 
    ? new TmdbLocalService(mockData) 
    : new TmdbApiService();

  return await repository.fetchMovies(filters);
}