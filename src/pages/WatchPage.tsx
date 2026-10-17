import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getMovieById } from '../services/movieService';
import { parseGoogleDriveUrl } from '../lib/googleDrive';
import { Movie } from '../types';
import { Badge } from '../components/common/Badge';
import { 
  ArrowLeft, 
  AlertTriangle, 
  ExternalLink, 
  RefreshCw, 
  HardDrive, 
  Info, 
  Sparkles, 
  Loader2,
  Film,
  Maximize,
  Minimize,
  Tv,
  Eye
} from 'lucide-react';

export type PlayerMode = 'fit' | 'frameless' | 'theater' | 'classic';

export const WatchPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [iframeKey, setIframeKey] = useState(0);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [playerMode, setPlayerMode] = useState<PlayerMode>('fit');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const playerContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    window.scrollTo(0, 0);

    async function loadMovie() {
      if (!id) return;
      setLoading(true);
      setError(null);

      try {
        const data = await getMovieById(id);
        if (isMounted) {
          if (!data) {
            setError('Film tidak ditemukan di katalog.');
          } else {
            setMovie(data);
          }
          setLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || 'Gagal memuat tayangan film.');
          setLoading(false);
        }
      }
    }

    loadMovie();

    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);

    return () => {
      isMounted = false;
      document.removeEventListener('fullscreenchange', handleFsChange);
    };
  }, [id]);

  const handleReloadIframe = () => {
    setIframeLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      playerContainerRef.current.requestFullscreen().catch(() => {});
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg-primary)]">
        <Loader2 className="w-10 h-10 text-[var(--color-gold-primary)] animate-spin" />
        <p className="mt-4 text-xs tracking-widest uppercase text-[var(--color-text-secondary)]">
          Menyiapkan Pemutar Bioskop Sinema...
        </p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)] px-4">
        <div className="max-w-md w-full glass-panel p-8 rounded-2xl text-center border border-red-500/30">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold font-cinzel text-[var(--color-text-primary)] mb-2">
            Tayangan Tidak Tersedia
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6">
            {error || 'Data film tidak dapat diakses saat ini.'}
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

  // Parse Google Drive Video URL
  const driveResult = parseGoogleDriveUrl(movie.driveUrl);

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] pt-20 pb-20 transition-all duration-300">
      {/* Top Bar with Back Navigation & Player Sizing Modes */}
      <div className={`mx-auto px-4 sm:px-6 lg:px-8 py-3 transition-all duration-300 ${
        playerMode === 'theater' ? 'max-w-full' : 'max-w-7xl'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => navigate(`/movie/${movie.id}`)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl glass-card text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-border-glass)] transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Detail Film</span>
          </button>

          {/* Sizing & Mode Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center p-1 rounded-xl glass-card border border-[var(--color-border-subtle)] text-xs">
              <button
                onClick={() => setPlayerMode('fit')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  playerMode === 'fit'
                    ? 'gold-button shadow-sm font-bold text-black'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
                title="Tinggi proporsional + header Drive (Subtitle dan kontrol tidak terpotong)"
              >
                Pas Subtitle (Anti-Potong)
              </button>

              <button
                onClick={() => setPlayerMode('frameless')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  playerMode === 'frameless'
                    ? 'gold-button shadow-sm font-bold text-black'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
                title="Sembunyikan bar atas Google Drive agar tampilan video 100% bersih seperti bioskop"
              >
                Sinema Bersih
              </button>

              <button
                onClick={() => setPlayerMode('theater')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  playerMode === 'theater'
                    ? 'gold-button shadow-sm font-bold text-black'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
                title="Mode Teater Lebar (Layar Penuh Horizontal)"
              >
                Teater
              </button>

              <button
                onClick={() => setPlayerMode('classic')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                  playerMode === 'classic'
                    ? 'gold-button shadow-sm font-bold text-black'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`}
                title="16:9 Standar"
              >
                16:9
              </button>
            </div>

            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl glass-card border border-[var(--color-border-subtle)] hover:border-[var(--color-border-glass)] text-[var(--color-text-secondary)] hover:text-[var(--color-gold-primary)] transition-colors cursor-pointer"
              title={isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh (Fullscreen)'}
              aria-label="Layar Penuh"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Cinema Screen Container */}
      <div
        ref={playerContainerRef}
        className={`mx-auto transition-all duration-300 ${
          playerMode === 'theater'
            ? 'max-w-full px-0 sm:px-4'
            : 'max-w-7xl px-4 sm:px-6 lg:px-8'
        }`}
      >
        <div className={`relative overflow-hidden glass-panel border border-[var(--color-border-glass)] shadow-2xl bg-black ${
          playerMode === 'theater' ? 'rounded-none sm:rounded-2xl' : 'rounded-2xl'
        }`}>
          {/* Subtle gold glow behind player */}
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-600/10 via-amber-400/10 to-amber-600/10 blur-xl opacity-50 -z-10" />

          {driveResult.isValid && driveResult.embedUrl ? (
            <div
              className={`relative w-full bg-black flex items-center justify-center overflow-hidden transition-all duration-300`}
              style={
                playerMode === 'fit'
                  ? { height: 'calc(min(100vw - 32px, 1280px) * 0.5625 + 56px)', maxHeight: '82vh' }
                  : playerMode === 'theater'
                  ? { height: 'min(78vh, 850px)', minHeight: '440px' }
                  : playerMode === 'frameless' || playerMode === 'classic'
                  ? { aspectRatio: '16/9', maxHeight: '80vh' }
                  : undefined
              }
            >
              {/* Loading spinner while iframe initializes */}
              {iframeLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-20">
                  <Loader2 className="w-8 h-8 text-[var(--color-gold-primary)] animate-spin" />
                  <p className="mt-3 text-xs text-zinc-400 font-mono">
                    Memuat Aliran Video Google Drive...
                  </p>
                </div>
              )}

              <iframe
                key={iframeKey}
                src={driveResult.embedUrl}
                title={`Pemutar Film - ${movie.title}`}
                className={`border-0 ${
                  playerMode === 'frameless'
                    ? 'absolute -top-[52px] left-0 w-full'
                    : 'w-full h-full'
                }`}
                style={
                  playerMode === 'frameless'
                    ? { height: 'calc(100% + 52px)' }
                    : { width: '100%', height: '100%' }
                }
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                loading="lazy"
                onLoad={() => setIframeLoading(false)}
              />
            </div>
          ) : (
            <div className="aspect-video w-full flex flex-col items-center justify-center p-8 text-center bg-zinc-950 text-zinc-400">
              <AlertTriangle className="w-12 h-12 text-amber-500 mb-4" />
              <h3 className="font-cinzel text-lg font-bold text-white mb-2">
                Format Link Google Drive Tidak Valid
              </h3>
              <p className="text-xs text-zinc-400 max-w-md mb-6 leading-relaxed">
                {driveResult.error || 'Link Google Drive pada film ini tidak memiliki File ID yang valid.'}
              </p>
              <Link
                to={`/movie/${movie.id}`}
                className="gold-button px-5 py-2.5 rounded-xl text-xs font-bold"
              >
                Kembali ke Detail
              </Link>
            </div>
          )}
        </div>

        {/* Player Controls & Info Bar */}
        <div className="mt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-[var(--color-gold-primary)] flex items-center justify-center shrink-0">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-cinzel text-lg font-bold text-[var(--color-text-primary)]">
                {movie.title}
              </h1>
              <p className="text-xs text-[var(--color-text-muted)]">
                Format Video: Google Drive Embedded Preview (1080p Stream)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
            <button
              onClick={handleReloadIframe}
              className="px-3 py-2 rounded-xl text-xs font-medium glass-card text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] flex items-center gap-1.5 cursor-pointer"
              title="Muat ulang pemutar"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Muat Ulang</span>
            </button>

            {driveResult.viewUrl && (
              <a
                href={driveResult.viewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="gold-button px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md"
                title="Buka langsung di Google Drive jika ada pembatasan iframe browser"
              >
                <span>Buka di Google Drive</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Google Drive Permission Advisory Note */}
        <div className="mt-6 p-5 rounded-2xl glass-panel border border-amber-500/20 bg-amber-500/5 space-y-3">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-[var(--color-gold-primary)] shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs leading-relaxed text-[var(--color-text-secondary)]">
              <h4 className="font-bold text-[var(--color-text-primary)] text-sm font-cinzel">
                Informasi Pemutaran Video Google Drive
              </h4>
              <p>
                Video ini di-host pada server Google Drive. Jika video menampilkan pesan <em>&ldquo;Akses ditolak&rdquo;</em> atau <em>&ldquo;Perlu izin akses&rdquo;</em>, pastikan akun Google Drive pengunggah telah mengaktifkan izin <strong>&ldquo;Siapa saja yang memiliki link dapat melihat&rdquo;</strong>.
              </p>
              <p className="text-[11px] text-[var(--color-text-muted)]">
                Catatan: URL preview Google Drive bukan merupakan direct MP4 streaming file, melainkan antarmuka streaming resmi yang disediakan oleh Google Drive. Jika browser Anda memblokir cookie pihak ketiga (third-party cookies), gunakan tombol <strong>&ldquo;Buka di Google Drive&rdquo;</strong> di atas untuk memutar video tanpa hambatan.
              </p>
            </div>
          </div>
        </div>

        {/* Synopsis & Details */}
        <div className="mt-8 glass-panel p-6 rounded-2xl border border-[var(--color-border-subtle)] space-y-3">
          <h3 className="font-cinzel text-sm font-bold uppercase tracking-wider text-[var(--color-gold-primary)]">
            Tentang Film Ini
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-line">
            {movie.description}
          </p>
        </div>
      </div>
    </div>
  );
};
