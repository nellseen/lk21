import React from 'react';
import { Modal } from '../common/Modal';
import { parseYouTubeUrl } from '../../lib/youtube';
import { AlertCircle, ExternalLink } from 'lucide-react';
import { Movie } from '../../types';

interface TrailerModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TrailerModal: React.FC<TrailerModalProps> = ({ movie, isOpen, onClose }) => {
  if (!movie) return null;

  const parsedTrailer = movie.trailerUrl ? parseYouTubeUrl(movie.trailerUrl) : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Trailer: ${movie.title}`}
      maxWidth="4xl"
    >
      <div className="space-y-4">
        {parsedTrailer && parsedTrailer.isValid && parsedTrailer.embedUrl ? (
          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black shadow-2xl border border-white/10">
            <iframe
              src={parsedTrailer.embedUrl}
              title={`Trailer Resmi - ${movie.title}`}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          </div>
        ) : (
          <div className="aspect-video w-full rounded-xl bg-black/60 flex flex-col items-center justify-center p-6 text-center border border-amber-500/20">
            <AlertCircle className="w-10 h-10 text-[var(--color-gold-primary)] mb-3" />
            <h4 className="text-base font-bold text-[var(--color-text-primary)] mb-1">
              Trailer Tidak Tersedia
            </h4>
            <p className="text-xs text-[var(--color-text-secondary)] max-w-sm mb-4">
              {movie.trailerUrl
                ? 'Format link trailer YouTube tidak dapat diproses atau dibatasi oleh pemilik video.'
                : 'Film ini belum memiliki link trailer YouTube.'}
            </p>
            {movie.trailerUrl && (
              <a
                href={movie.trailerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="gold-button inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs"
              >
                <span>Buka di YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)] pt-2 border-t border-[var(--color-border-subtle)]">
          <span>Kategori: <strong className="text-[var(--color-text-primary)]">{movie.category}</strong></span>
          <span className="font-mono text-[10px] text-[var(--color-text-muted)]">YouTube Player Integration</span>
        </div>
      </div>
    </Modal>
  );
};
