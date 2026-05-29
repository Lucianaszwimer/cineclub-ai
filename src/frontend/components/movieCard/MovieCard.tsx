import React from 'react';
import { Movie } from '../../../shared/types/movie';

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const getRatingColor = (rating: number) => {
    if (rating >= 8) return 'text-emerald-400';
    if (rating >= 6) return 'text-yellow-400';
    return 'text-red-500';
  };

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 hover:border-indigo-500 transition-all group shadow-lg">
      <a href={`https://www.google.com/search?q=${encodeURIComponent(movie.title)}`} target="_blank" rel="noopener noreferrer">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-zinc-100 font-bold text-sm group-hover:text-indigo-400 transition-colors">{movie.title}</h3>
          <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 ${getRatingColor(movie.rating)}`}>
            ⭐ {movie.rating.toFixed(1)}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap gap-1">
            {movie.genres.map((g, i) => (
              <span key={i} className="text-[10px] uppercase tracking-wider bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/20">
                {g}
              </span>
            ))}
          </div>

          <div className="flex justify-between items-center text-[11px] text-zinc-500 pt-2 border-t border-zinc-800/50">
            <span>📅 {movie.year || 'N/A'}</span>
            <span className="uppercase font-medium">🌍 {movie.original_language || '??'}</span>
          </div>
        </div>
      </a>
    </div>
  );
};
