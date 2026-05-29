export interface MovieFilters {
  title?: string;
  genres?: string;
  year?: number;
  rating?: number;
  original_language?: string;
  limit?: number;
  sort?: 'worst' | 'best';
}
