import axios from 'axios';
import { IMovieRepository, MovieFilters } from '../interfaces/movieInterface';
import { movieArraySchema } from '../schemas/movieSchema';
import { Movie } from '../schemas/movieSchema';

export class TmdbApiService implements IMovieRepository {
  private apiKey = process.env.TMDB_API_KEY;
  private baseUrl = process.env.TMDB_BASE_URL;

  private genreNameToIdMap: Map<string, number> = new Map();
  private genreIdToNameMap: Map<number, string> = new Map();
  private languageNameToIsoMap: Map<string, string> = new Map();
  private isCacheLoaded = false;

  //para traducir idiomas (para un futuro no tener esto hardcodeado pero las apis que encontre eran pagas para traducir :'( ))
  private spanishToEnglishLanguageMap: { [key: string]: string } = {
    'español': 'spanish',
    'castellano': 'spanish',
    'ingles': 'english',
    'frances': 'french',
    'italiano': 'italian',
    'aleman': 'german',
    'japones': 'japanese',
    'coreano': 'korean',
    'portugues': 'portuguese',
    'chino': 'chinese',
    'ruso': 'russian',
    'hebreo': 'hebrew'
  };

  //(ejecuta solo una vez)
  private async initializeCache(): Promise<void> {
    if (this.isCacheLoaded) return;

    try {
      const [genresResponse, languagesResponse] = await Promise.all([
        axios.get(`${this.baseUrl}/genre/movie/list`, { params: { api_key: this.apiKey, language: 'es-ES' } }),
        axios.get(`${this.baseUrl}/configuration/languages`, { params: { api_key: this.apiKey } })
      ]);

      const genres = genresResponse.data.genres || [];
      genres.forEach((g: { id: number; name: string }) => {
        const cleanName = this.cleanText(g.name);
        this.genreNameToIdMap.set(cleanName, g.id);
        this.genreIdToNameMap.set(g.id, cleanName);
      });

      const languages = languagesResponse.data || [];
      languages.forEach((l: { iso_639_1: string; english_name: string }) => {
        const cleanEnglishName = this.cleanText(l.english_name);
        this.languageNameToIsoMap.set(cleanEnglishName, l.iso_639_1);
      });

      this.isCacheLoaded = true;
      console.log("Memoria caché de TMDB inicializada de forma eficiente.");
    } catch (error) {
      console.error("❌ Error inicializando datos dinámicos de TMDB:", error);
    }
  }

  private cleanText(str: string): string {
    return str
      .toLowerCase() //minusucla
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // saca tildes
      .trim();
  }

  async fetchMovies(filters: MovieFilters): Promise<Movie[]> {
    await this.initializeCache();

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
        .map((g) => this.genreNameToIdMap.get(this.cleanText(g)))
        .filter((v): v is number => !!v);

      if (genreIds.length > 0) {
        queryParams.with_genres = genreIds.join(',');
      }
    }

    if (filters.rating) {
      queryParams['vote_average.gte'] = filters.rating;
    }

    if (filters.original_language) {
      const cleanInput = this.cleanText(filters.original_language);

      if (cleanInput.length === 2) {
        queryParams.with_original_language = cleanInput;
      } else {
        const englishName = this.spanishToEnglishLanguageMap[cleanInput] || cleanInput;
        const isoCode = this.languageNameToIsoMap.get(englishName);

        if (isoCode) {
          queryParams.with_original_language = isoCode;
        } else {
          console.warn(`Idioma no encontrado en TMDB: ${filters.original_language}`);
        }        
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

      const mappedMovies = tmdbResults.map((movie: TMDBMovie) => {
        let finalGenres: string[] = [];

        if (filters.genres) {
          finalGenres = filters.genres.split(',').map((g) => g.trim().toLowerCase());
        } else if (movie.genre_ids && movie.genre_ids.length > 0) {
          finalGenres = movie.genre_ids
            .map((id) => this.genreIdToNameMap.get(id))
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
}