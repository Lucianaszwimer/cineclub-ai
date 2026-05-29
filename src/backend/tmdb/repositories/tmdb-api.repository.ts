import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { ExternalServiceError } from '../../common/errors/app.error';
import { AppConfigService } from '../../config/config.service';
import { TmdbGenre, TmdbLanguage, TmdbListResponse, TmdbMovieResult } from '../interfaces/tmdb.types';

@Injectable()
export class TmdbApiRepository {
  constructor(@Inject(AppConfigService) private readonly config: AppConfigService) {}

  private get apiKey(): string {
    return this.config.get('TMDB_API_KEY');
  }

  private get baseUrl(): string {
    return this.config.get('TMDB_BASE_URL');
  }

  async fetchGenres(): Promise<TmdbGenre[]> {
    try {
      const response = await axios.get<{ genres: TmdbGenre[] }>(`${this.baseUrl}/genre/movie/list`, {
        params: { api_key: this.apiKey, language: 'es-ES' }
      });
      return response.data.genres || [];
    } catch (error) {
      throw new ExternalServiceError('Error al obtener géneros desde TMDB.', error);
    }
  }

  async fetchLanguages(): Promise<TmdbLanguage[]> {
    try {
      const response = await axios.get<TmdbLanguage[]>(`${this.baseUrl}/configuration/languages`, {
        params: { api_key: this.apiKey }
      });
      return response.data || [];
    } catch (error) {
      throw new ExternalServiceError('Error al obtener idiomas desde TMDB.', error);
    }
  }

  async searchOrDiscover(
    endpoint: 'search' | 'discover',
    queryParams: Record<string, string | number | undefined>
  ): Promise<TmdbMovieResult[]> {
    const path = endpoint === 'search' ? '/search/movie' : '/discover/movie';

    try {
      const response = await axios.get<TmdbListResponse<TmdbMovieResult>>(`${this.baseUrl}${path}`, {
        params: {
          api_key: this.apiKey,
          language: 'es-ES',
          ...queryParams
        }
      });

      return response.data.results || [];
    } catch (error) {
      throw new ExternalServiceError('Error consultando catálogo TMDB.', error);
    }
  }
}
