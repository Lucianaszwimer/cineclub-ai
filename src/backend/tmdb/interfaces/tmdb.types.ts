export interface TmdbGenre {
  id: number;
  name: string;
}

export interface TmdbLanguage {
  iso_639_1: string;
  english_name: string;
}

export interface TmdbMovieResult {
  title?: string;
  original_title?: string;
  release_date?: string;
  vote_average?: number;
  genre_ids?: number[];
  original_language?: string;
}

export interface TmdbListResponse<T> {
  results?: T[];
}
