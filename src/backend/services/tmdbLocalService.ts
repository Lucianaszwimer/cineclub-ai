import { IMovieRepository, MovieFilters } from '../interfaces/movieInterface';
import { movieArraySchema } from '../schemas/movieSchema';
import { Movie } from '../schemas/movieSchema';

export class TmdbLocalService implements IMovieRepository {
  private mockDatabase: Movie[];

  constructor(initialMovies?: Movie[]) {
    this.mockDatabase = initialMovies || [
      { title: "Toy Story", genres: ["animacion", "comedia"], year: 1995, rating: 8.3 },
      { title: "When Harry Met Sally", genres: ["romance"], year: 1989, rating: 7.6 },
      { title: "Back to the Future", genres: ["ciencia ficcion", "comedia", "aventuras"], year: 1985, rating: 8.5 },
      { title: "Ratatouille", genres: ["animacion", "comedia"], year: 2007, rating: 8.0 },
      { title: "Devil Wears Prada", genres: ["comedia"], year: 2006, rating: 6.9 },
      { title: "IT", genres: ["terror"], year: 2017, rating: 7.3 },
      { title: "Good Will Hunting", genres: ["drama"], year: 1997, rating: 8.3 },
      { title: "Little Women", genres: ["drama", "romance"], year: 2019, rating: 7.8 },
      { title: "ET", genres: ["ciencia ficcion"], year: 1982, rating: 7.8 }
    ];
  }

  async fetchMovies(filters: MovieFilters): Promise<Movie[]> {
    let filtered = [...this.mockDatabase];

    if (filters.title) {
      const cleanTitle = filters.title.toLowerCase().trim();
      filtered = filtered.filter((m) => m.title.toLowerCase().includes(cleanTitle));
    }

    if (filters.year) {
      filtered = filtered.filter((m) => m.year === filters.year);
    }

    if (filters.rating !== undefined) {
      filtered = filtered.filter((m) => m.rating >= filters.rating!);
    }

    if (filters.genres) {
      const searchGenres = filters.genres.split(',').map((g) => g.trim().toLowerCase());
      filtered = filtered.filter((m) =>
        m.genres.some((g) => searchGenres.includes(g))
      );
    }

    return movieArraySchema.parse(filtered);
  }
}