import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getMovieById } from '../services/movieService';
import { useMovies } from '../hooks/useMovies';
import { Movie } from '../types';
import { Badge } from '../components/common/Badge';
import { MovieCard } from '../components/movie/MovieCard';
import { TrailerModal } from '../components/movie/TrailerModal';
import { parseYouTubeUrl } from '../lib/youtube';
import { 
  Play, 
  ArrowLeft, 
  Youtube, 
  Sparkles, 
  Calendar, 
  Share2, 
  Film, 
  AlertCircle, 
  Loader2,
  HardDrive
} from 'lucide-react';

export const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { movies, getMoviesByCategory } = useMovies();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    let isMounted = true;
    window.scrollTo(0, 0);

    async function fetchDetail() {
      if (!id) return;
      setLoading(true);
      setError(null);

      // Check if already in movies memory
      const cached = movies.find((m) => m.id === id);
      if (cached) {
        setMovie(cached);
        setLoading(false);
        return;
      }

      try {
        const data = await getMovieById(id);
        if (isMounted) {
          if (!data) {
            setError('Film dengan ID tersebut tidak ditemukan di katalog.');
          } else {
            setMovie(data);
          }
          setLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || 'Gagal memuat informasi film.');
          setLoading(false);
        }
      }
    }

    fetchDetail();

    return () => {
      isMounted = false;
    };
  }, [id, movies]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg-primary)]">
        <Loader2 className="w-8 h-8 text-[var(--color-gold-primary)] animate-spin" />
        <p className="mt-3 text-xs tracking-widest uppercase text-[var(--color-text-secondary)]">
          Memuat Arsip Sinema...
        </p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)] px-4">
        <div className="max-w-md w-full glass-panel p-8 rounded-2xl text-center border border-red-500/30 shadow-2xl">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold font-cinzel text-[var(--color-text-primary)] mb-2">
            Film Tidak Ditemukan
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6">
            {error || 'Data film mungkin telah dipindahkan atau dihapus dari sistem.'}
          </p>
          <Link
            to="/browse"
            className="gold-button inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Katalog
          </Link>
        </div>
      </div>
    );
  }

  // Related movies in same category
  const relatedMovies = getMoviesByCategory(movie.category)
    .filter((m) => m.id !== movie.id)
    .slice(0, 6);

  const parsedTrailer = movie.trailerUrl ? parseYouTubeUrl(movie.trailerUrl) : null;

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] pb-20">
      {/* Backdrop Header */}
      <div className="relative w-full h-[55vh] min-h-[420px] max-h-[600px] overflow-hidden bg-black">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover object-top filter brightness-[0.4] blur-sm scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-primary)] via-[var(--color-bg-primary)]/80 to-transparent" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/40 to-[var(--color-bg-primary)]" />

        {/* Back Link */}
        <div className="absolute top-24 left-4 sm:left-8 z-20">
          <button
            onClick={() => navigate(-1)}
            className="glass-card px-4 py-2 rounded-xl text-xs font-semibold text-white hover:text-[var(--color-gold-primary)] flex items-center gap-2 transition-all cursor-pointer backdrop-blur-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>
        </div>
      </div>

      {/* Main Detail Content Box */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-40 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left: Poster Card (4 Cols) */}
          <div className="md:col-span-4 lg:col-span-3">
            <div className="glass-panel p-2 rounded-2xl shadow-2xl border border-[var(--color-border-glass)] overflow-hidden">
              <div className="aspect-[2/3] w-full rounded-xl overflow-hidden bg-black">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-4 space-y-2.5">
              <Link
                to={`/watch/${movie.id}`}
                className="w-full gold-button py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-xl"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>Tonton Film Sekarang</span>
              </Link>

              {movie.trailerUrl && (
                <button
                  onClick={() => setIsTrailerModalOpen(true)}
                  className="w-full py-3 rounded-xl text-xs font-semibold glass-card text-white hover:border-[var(--color-border-glass)] hover:text-[var(--color-gold-primary)] flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Youtube className="w-4 h-4 text-red-500" />
                  <span>Putar Trailer YouTube</span>
                </button>
              )}

              <button
                onClick={handleShare}
                className="w-full py-2.5 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border border-white/5 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedLink ? 'Link Tersalin!' : 'Bagikan Film'}</span>
              </button>
            </div>
          </div>

          {/* Right: Information, Metadata, Synopsis & Embedded Trailer (8 Cols) */}
          <div className="md:col-span-8 lg:col-span-9 space-y-6">
            {/* Title & Badges */}
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-3">
                {movie.featured && (
                  <Badge variant="featured" className="text-xs">
                    <Sparkles className="w-3 h-3 mr-1 inline" />
                    Koleksi Unggulan
                  </Badge>
                )}
                <Badge variant="gold" className="text-xs">
                  {movie.category}
                </Badge>
                <span className="text-xs text-[var(--color-text-muted)] flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(movie.createdAt).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>

              <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-black text-[var(--color-text-primary)] tracking-tight">
                {movie.title}
              </h1>
            </div>

            {/* Synopsis Card */}
            <div className="glass-panel p-6 rounded-2xl border border-[var(--color-border-subtle)] space-y-3">
              <h3 className="font-cinzel text-sm font-bold uppercase tracking-wider text-[var(--color-gold-primary)]">
                Sinopsis Film
              </h3>
              <p className="text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-line">
                {movie.description}
              </p>
            </div>

            {/* Video Technology Info */}
            <div className="glass-panel p-5 rounded-2xl border border-[var(--color-border-subtle)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                  <HardDrive className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[var(--color-text-primary)]">
                    Streaming Berkecepatan Tinggi Google Drive
                  </h4>
                  <p className="text-[11px] text-[var(--color-text-muted)]">
                    Kualitas Full HD 1080p dengan server terdistribusi Google
                  </p>
                </div>
              </div>

              <Link
                to={`/watch/${movie.id}`}
                className="gold-button px-5 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 shrink-0"
              >
                <Play className="w-3.5 h-3.5 fill-black" />
                <span>Buka Pemutar</span>
              </Link>
            </div>

            {/* Embedded YouTube Trailer if Available */}
            {parsedTrailer && parsedTrailer.isValid && parsedTrailer.embedUrl && (
              <div className="pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-cinzel text-base font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                    <Youtube className="w-5 h-5 text-red-500" />
                    <span>Trailer Resmi YouTube</span>
                  </h3>
                </div>
                <div className="aspect-video w-full rounded-2xl overflow-hidden glass-panel border border-white/10 shadow-2xl">
                  <iframe
                    src={parsedTrailer.embedUrl}
                    title={`Trailer ${movie.title}`}
                    className="w-full h-full"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Movies Section */}
        {relatedMovies.length > 0 && (
          <div className="mt-16 pt-12 border-t border-[var(--color-border-subtle)]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[var(--color-text-primary)]">
                  Film Terkait: {movie.category}
                </h3>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                  Koleksi sinematik lain dengan genre yang serupa
                </p>
              </div>
              <Link
                to={`/browse?category=${encodeURIComponent(movie.category)}`}
                className="text-xs font-semibold text-[var(--color-gold-primary)] hover:underline"
              >
                Lihat Semua
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
              {relatedMovies.map((item) => (
                <MovieCard key={item.id} movie={item} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Trailer Modal */}
      <TrailerModal
        movie={movie}
        isOpen={isTrailerModalOpen}
        onClose={() => setIsTrailerModalOpen(false)}
      />
    </div>
  );
};
