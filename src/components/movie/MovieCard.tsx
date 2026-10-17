import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Play, Info, Sparkles, Film } from 'lucide-react';
import { Movie } from '../../types';
import { Badge } from '../common/Badge';

interface MovieCardProps {
  movie: Movie;
  onPlayTrailer?: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onPlayTrailer }) => {
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="group relative rounded-xl overflow-hidden glass-card transition-all duration-300 hover:-translate-y-1.5 focus-within:ring-2 focus-within:ring-[var(--color-gold-primary)]">
      {/* Aspect Ratio 2:3 Poster */}
      <div className="aspect-[2/3] w-full overflow-hidden relative bg-[var(--color-bg-secondary)]">
        {!imageError && movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            onError={() => setImageError(true)}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-zinc-800 to-zinc-950 text-zinc-400">
            <Film className="w-10 h-10 mb-2 text-[var(--color-gold-primary)] opacity-60" />
            <span className="text-xs font-cinzel line-clamp-2 px-2 text-zinc-200">
              {movie.title}
            </span>
          </div>
        )}

        {/* Featured Ribbon Badge */}
        {movie.featured && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <Badge variant="featured" className="text-[10px] px-2 py-0.5 shadow-md">
              <Sparkles className="w-3 h-3 mr-1 inline text-amber-300" />
              Unggulan
            </Badge>
          </div>
        )}

        {/* Category Pill */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <Badge variant="category" className="text-[10px] bg-black/60 backdrop-blur-md">
            {movie.category}
          </Badge>
        </div>

        {/* Cinematic Gradient Mask */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />

        {/* Interactive Hover Actions */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 z-20">
          <h3 className="font-cinzel font-bold text-sm text-white line-clamp-1 mb-1 drop-shadow-md group-hover:text-[var(--color-gold-primary)] transition-colors">
            {movie.title}
          </h3>

          <p className="text-[11px] text-zinc-300 line-clamp-2 mb-3 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {movie.description}
          </p>

          <div className="flex items-center gap-2 pt-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Link
              to={`/watch/${movie.id}`}
              className="flex-1 gold-button py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg"
              title="Tonton Film Sekarang"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>Putar</span>
            </Link>

            <Link
              to={`/movie/${movie.id}`}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white backdrop-blur-md transition-colors"
              title="Lihat Detail Film"
              aria-label={`Detail ${movie.title}`}
            >
              <Info className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
