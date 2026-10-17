import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Info, Sparkles, Film, Youtube } from 'lucide-react';
import { Movie } from '../../types';
import { Badge } from '../common/Badge';

interface HeroBannerProps {
  movie: Movie;
  onOpenTrailer?: (movie: Movie) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ movie, onOpenTrailer }) => {
  return (
    <div className="relative w-full h-[70vh] min-h-[500px] max-h-[780px] overflow-hidden bg-black">
      {/* Background Poster / Backdrop Image */}
      <div className="absolute inset-0">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover object-top scale-105 filter brightness-[0.65] blur-[1px] md:blur-none"
        />
        {/* Cinematic Vignettes */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-primary)] via-[var(--color-bg-primary)]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-bg-primary)] via-[var(--color-bg-primary)]/80 to-transparent max-w-4xl" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/40 to-black/80" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16 md:pb-24">
        <div className="max-w-2xl space-y-4">
          {/* Badges */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <Badge variant="featured" className="text-xs py-1 px-3">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 inline" />
              Koleksi Unggulan
            </Badge>
            <Badge variant="outline" className="text-xs py-1 px-3 bg-black/40">
              {movie.category}
            </Badge>
            <span className="text-xs text-[var(--color-gold-primary)] font-mono tracking-wider">
              AURASTREAM EXCLUSIVE
            </span>
          </div>

          {/* Title */}
          <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-2xl leading-none">
            {movie.title}
          </h1>

          {/* Synopsis */}
          <p className="text-sm md:text-base text-zinc-300 line-clamp-3 leading-relaxed drop-shadow-md">
            {movie.description}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 flex-wrap">
            <Link
              to={`/watch/${movie.id}`}
              className="gold-button px-7 py-3.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-2xl"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>Tonton Sekarang</span>
            </Link>

            {movie.trailerUrl && onOpenTrailer && (
              <button
                onClick={() => onOpenTrailer(movie)}
                className="px-5 py-3.5 rounded-xl text-sm font-semibold glass-card text-white hover:text-[var(--color-gold-primary)] hover:border-[var(--color-gold-primary)]/50 flex items-center gap-2 transition-all cursor-pointer backdrop-blur-md"
              >
                <Youtube className="w-4 h-4 text-red-500" />
                <span>Trailer Resmi</span>
              </button>
            )}

            <Link
              to={`/movie/${movie.id}`}
              className="px-5 py-3.5 rounded-xl text-sm font-semibold glass-card text-white hover:border-[var(--color-border-glass)] flex items-center gap-2 transition-all backdrop-blur-md"
            >
              <Info className="w-4 h-4" />
              <span>Detail Film</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
