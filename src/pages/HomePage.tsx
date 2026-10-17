import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMovies } from '../hooks/useMovies';
import { HeroBanner } from '../components/movie/HeroBanner';
import { MovieSlider } from '../components/movie/MovieSlider';
import { TrailerModal } from '../components/movie/TrailerModal';
import { HeroSkeleton, MovieGridSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { Movie, MOVIE_CATEGORIES } from '../types';
import { Sparkles, Compass, Flame, Film, Clapperboard } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { movies, featuredMovies, latestMovies, loading, error, categories, getMoviesByCategory } = useMovies();
  const [activeTrailerMovie, setActiveTrailerMovie] = useState<Movie | null>(null);

  // Choose primary hero movie: First featured movie, or newest movie
  const heroMovie = featuredMovies.length > 0 ? featuredMovies[0] : movies.length > 0 ? movies[0] : null;

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)]">
      {/* 1. Hero Banner */}
      {loading ? (
        <div className="pt-20 px-4 max-w-7xl mx-auto">
          <HeroSkeleton />
        </div>
      ) : heroMovie ? (
        <HeroBanner
          movie={heroMovie}
          onOpenTrailer={(m) => setActiveTrailerMovie(m)}
        />
      ) : error ? (
        <div className="pt-32 pb-12 px-4 max-w-7xl mx-auto">
          <EmptyState
            title="Katalog Memerlukan Autentikasi"
            description={error}
            actionText="Masuk dengan Google"
            actionLink="/login"
          />
        </div>
      ) : (
        <div className="pt-32 pb-12 px-4 max-w-7xl mx-auto">
          <EmptyState
            title="Katalog Sinema Siap Diisi"
            description="Belum ada film yang dipublikasikan ke database. Masuk ke panel admin untuk menambahkan film perdana."
          />
        </div>
      )}

      {/* 2. Category Quick Pills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20">
        <div className="glass-panel p-4 rounded-2xl border border-[var(--color-border-glass)] shadow-xl flex items-center gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[var(--color-gold-primary)] uppercase tracking-wider shrink-0 border-r border-[var(--color-border-subtle)] mr-2">
            <Compass className="w-4 h-4" />
            <span>Kategori:</span>
          </div>
          {MOVIE_CATEGORIES.map((cat) => (
            <Link
              key={cat}
              to={`/browse?category=${encodeURIComponent(cat)}`}
              className="px-3.5 py-1.5 rounded-xl text-xs font-medium glass-card hover:border-[var(--color-border-glass)] hover:text-[var(--color-gold-primary)] transition-all shrink-0 text-[var(--color-text-secondary)]"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* Content Rows */}
      {loading ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          <MovieGridSkeleton count={5} />
        </div>
      ) : movies.length > 0 ? (
        <div className="py-6 space-y-4">
          {/* A. Featured Carousel */}
          {featuredMovies.length > 0 && (
            <MovieSlider
              title="Koleksi Film Unggulan"
              subtitle="Pilihan teratas yang dikurasi secara khusus oleh dewan kurator sinema"
              movies={featuredMovies}
              onPlayTrailer={(m) => setActiveTrailerMovie(m)}
            />
          )}

          {/* B. Latest Additions Carousel */}
          {latestMovies.length > 0 && (
            <MovieSlider
              title="Baru Ditambahkan"
              subtitle="Film rilisan terbaru yang baru saja masuk ke arsip katalog"
              movies={latestMovies}
              onPlayTrailer={(m) => setActiveTrailerMovie(m)}
            />
          )}

          {/* C. Dynamic Category Sections */}
          {categories.slice(0, 4).map((categoryName) => {
            const categoryMovies = getMoviesByCategory(categoryName);
            if (categoryMovies.length === 0) return null;

            return (
              <MovieSlider
                key={categoryName}
                title={`Kategori: ${categoryName}`}
                subtitle={`Eksplorasi koleksi sinema dalam genre ${categoryName}`}
                movies={categoryMovies}
                onPlayTrailer={(m) => setActiveTrailerMovie(m)}
              />
            );
          })}
        </div>
      ) : null}

      {/* Trailer Modal Player */}
      <TrailerModal
        movie={activeTrailerMovie}
        isOpen={Boolean(activeTrailerMovie)}
        onClose={() => setActiveTrailerMovie(null)}
      />
    </div>
  );
};
