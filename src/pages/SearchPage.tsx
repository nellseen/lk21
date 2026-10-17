import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMovies } from '../hooks/useMovies';
import { MovieCard } from '../components/movie/MovieCard';
import { MovieGridSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { TrailerModal } from '../components/movie/TrailerModal';
import { Search, X, Sparkles, Film } from 'lucide-react';
import { Movie, MOVIE_CATEGORIES } from '../types';

export const SearchPage: React.FC = () => {
  const { movies, loading } = useMovies();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialQuery = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [debouncedTerm, setDebouncedTerm] = useState(initialQuery);
  const [activeTrailerMovie, setActiveTrailerMovie] = useState<Movie | null>(null);

  // Debounce input to optimize rendering
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
      if (searchTerm.trim()) {
        setSearchParams({ q: searchTerm.trim() });
      } else {
        searchParams.delete('q');
        setSearchParams(searchParams);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchTerm, setSearchParams, searchParams]);

  const searchResults = useMemo(() => {
    const q = debouncedTerm.toLowerCase().trim();
    if (!q) return [];

    return movies.filter((movie) => {
      const matchTitle = movie.title.toLowerCase().includes(q);
      const matchDesc = movie.description.toLowerCase().includes(q);
      const matchCat = movie.category.toLowerCase().includes(q);
      return matchTitle || matchDesc || matchCat;
    });
  }, [movies, debouncedTerm]);

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header Banner */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="w-12 h-12 rounded-2xl bg-[var(--color-gold-glow)] text-[var(--color-gold-primary)] flex items-center justify-center mx-auto mb-4 border border-[var(--color-gold-primary)]/30">
            <Search className="w-6 h-6" />
          </div>
          <h1 className="font-cinzel text-3xl sm:text-4xl font-extrabold text-[var(--color-text-primary)] mb-3">
            Pencarian Koleksi Film
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Ketik judul film, aktor, genre, atau kata kunci sinopsis untuk menemukan tayangan favorit Anda.
          </p>

          {/* Search Input Bar */}
          <div className="mt-8 relative">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 absolute left-5 text-[var(--color-gold-primary)]" />
              <input
                type="text"
                autoFocus
                placeholder="Cari judul film, genre, atau kata kunci..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-12 py-4 rounded-2xl glass-panel border border-[var(--color-border-glass)] focus:border-[var(--color-gold-primary)] text-base text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] outline-none shadow-2xl transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] rounded-lg cursor-pointer"
                  aria-label="Hapus kata kunci pencarian"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Quick Keyword Pills */}
            <div className="flex items-center justify-center gap-2 flex-wrap mt-4">
              <span className="text-xs text-[var(--color-text-muted)]">Saran Pencarian:</span>
              {['Action', 'Sci-Fi', 'Unggulan', 'Drama', 'Thriller'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchTerm(tag)}
                  className="px-2.5 py-1 rounded-lg text-xs bg-white/5 hover:bg-white/10 text-[var(--color-gold-primary)] border border-white/5 transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Area */}
        {loading ? (
          <MovieGridSkeleton count={8} />
        ) : debouncedTerm.trim() ? (
          <div>
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-[var(--color-border-subtle)]">
              <h2 className="font-cinzel text-lg font-bold text-[var(--color-text-primary)]">
                Hasil Pencarian: &ldquo;{debouncedTerm}&rdquo;
              </h2>
              <span className="text-xs text-[var(--color-text-muted)]">
                {searchResults.length} film ditemukan
              </span>
            </div>

            {searchResults.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                {searchResults.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onPlayTrailer={(m) => setActiveTrailerMovie(m)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Search className="w-8 h-8" />}
                title="Tidak Ada Hasil Ditemukan"
                description={`Tidak ada film yang cocok dengan kata kunci "${debouncedTerm}". Coba periksa ejaan atau gunakan kata kunci lain.`}
                actionText="Hapus Pencarian"
                onAction={() => setSearchTerm('')}
              />
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <Film className="w-12 h-12 text-[var(--color-gold-primary)] opacity-30 mx-auto mb-3" />
            <p className="text-sm text-[var(--color-text-muted)]">
              Ketikkan kata kunci di kolom pencarian di atas untuk memulai pencarian.
            </p>
          </div>
        )}
      </div>

      {/* Trailer Modal Player */}
      <TrailerModal
        movie={activeTrailerMovie}
        isOpen={Boolean(activeTrailerMovie)}
        onClose={() => setActiveTrailerMovie(null)}
      />
    </div>
  );
};
