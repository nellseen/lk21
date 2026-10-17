import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMovies } from '../hooks/useMovies';
import { MovieCard } from '../components/movie/MovieCard';
import { MovieGridSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { TrailerModal } from '../components/movie/TrailerModal';
import { Movie, MOVIE_CATEGORIES } from '../types';
import { Compass, Filter, ArrowUpDown, Search, Sparkles } from 'lucide-react';

export const BrowsePage: React.FC = () => {
  const { movies, loading } = useMovies();
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategory = searchParams.get('category') || 'ALL';
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'title-asc' | 'title-desc' | 'featured'>('latest');
  const [activeTrailerMovie, setActiveTrailerMovie] = useState<Movie | null>(null);

  const handleCategorySelect = (cat: string) => {
    if (cat === 'ALL') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const filteredMovies = useMemo(() => {
    let result = [...movies];

    // Filter by Category
    if (selectedCategory !== 'ALL') {
      result = result.filter(
        (m) => m.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'latest':
          return (b.createdAt || 0) - (a.createdAt || 0);
        case 'oldest':
          return (a.createdAt || 0) - (b.createdAt || 0);
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        case 'featured':
          if (a.featured === b.featured) {
            return (b.createdAt || 0) - (a.createdAt || 0);
          }
          return a.featured ? -1 : 1;
        default:
          return 0;
      }
    });

    return result;
  }, [movies, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-gold-primary)] uppercase tracking-widest mb-1.5">
            <Compass className="w-4 h-4" />
            <span>Eksplorasi Katalog</span>
          </div>
          <h1 className="font-cinzel text-3xl sm:text-4xl font-extrabold text-[var(--color-text-primary)]">
            Jelajahi Seluruh Koleksi Film
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Temukan karya sinematik berdasarkan kategori, popularitas, atau rilisan terbaru.
          </p>
        </div>

        {/* Filter & Controls Bar */}
        <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-[var(--color-border-glass)] shadow-xl mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
              <input
                type="text"
                placeholder="Cari judul atau kata kunci..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] focus:border-[var(--color-gold-primary)] outline-none text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <ArrowUpDown className="w-4 h-4 text-[var(--color-gold-primary)]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2.5 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] focus:border-[var(--color-gold-primary)] outline-none text-xs font-semibold text-[var(--color-text-primary)] cursor-pointer"
              >
                <option value="latest">Rilisan Terbaru</option>
                <option value="featured">Unggulan Utama</option>
                <option value="title-asc">Judul (A - Z)</option>
                <option value="title-desc">Judul (Z - A)</option>
                <option value="oldest">Koleksi Terdahulu</option>
              </select>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-[var(--color-border-subtle)]">
            <button
              onClick={() => handleCategorySelect('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                selectedCategory === 'ALL'
                  ? 'gold-button shadow-md'
                  : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border-subtle)]'
              }`}
            >
              Semua ({movies.length})
            </button>

            {MOVIE_CATEGORIES.map((cat) => {
              const count = movies.filter((m) => m.category.toLowerCase() === cat.toLowerCase()).length;
              const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all cursor-pointer ${
                    isSelected
                      ? 'gold-button shadow-md font-bold'
                      : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-[var(--color-border-subtle)]'
                  }`}
                >
                  {cat} {count > 0 && `(${count})`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Movies Grid */}
        {loading ? (
          <MovieGridSkeleton count={12} />
        ) : filteredMovies.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-4 text-xs text-[var(--color-text-muted)]">
              <span>Menampilkan {filteredMovies.length} film</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
              {filteredMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onPlayTrailer={(m) => setActiveTrailerMovie(m)}
                />
              ))}
            </div>
          </div>
        ) : (
          <EmptyState
            title="Tidak Ada Film yang Cocok"
            description={
              searchQuery || selectedCategory !== 'ALL'
                ? 'Tidak ditemukan film dengan kriteria filter saat ini. Coba pilih kategori lain atau reset kata kunci pencarian.'
                : 'Belum ada film yang tersedia di katalog.'
            }
            actionText="Reset Filter"
            onAction={() => {
              setSearchQuery('');
              handleCategorySelect('ALL');
            }}
          />
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
