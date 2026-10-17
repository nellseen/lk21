import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie } from '../../types';
import { MovieCard } from './MovieCard';

interface MovieSliderProps {
  title: string;
  subtitle?: string;
  movies: Movie[];
  onPlayTrailer?: (movie: Movie) => void;
}

export const MovieSlider: React.FC<MovieSliderProps> = ({
  title,
  subtitle,
  movies,
  onPlayTrailer
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <section className="relative my-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[var(--color-text-primary)] tracking-wide">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-[var(--color-text-secondary)] mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {/* Scroll Controls */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => handleScroll('left')}
            className="p-2 rounded-xl glass-card hover:border-[var(--color-border-glass)] text-[var(--color-text-primary)] cursor-pointer transition-colors"
            aria-label="Geser ke kiri"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            className="p-2 rounded-xl glass-card hover:border-[var(--color-border-glass)] text-[var(--color-text-primary)] cursor-pointer transition-colors"
            aria-label="Geser ke kanan"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Track */}
      <div
        ref={scrollRef}
        className="flex items-stretch gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth py-2 -mx-2 px-2"
      >
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="w-[170px] sm:w-[210px] md:w-[230px] shrink-0"
          >
            <MovieCard movie={movie} onPlayTrailer={onPlayTrailer} />
          </div>
        ))}
      </div>
    </section>
  );
};
