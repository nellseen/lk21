import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { Movie } from '../../types';

interface DeleteConfirmModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (movieId: string) => Promise<void>;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  movie,
  isOpen,
  onClose,
  onConfirm
}) => {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!movie) return null;

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    try {
      await onConfirm(movie.id);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Gagal menghapus film.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => !deleting && onClose()}
      title="Konfirmasi Penghapusan Film"
      maxWidth="md"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <p className="text-xs">
            Tindakan ini tidak dapat dibatalkan. Data film akan dihapus secara permanen dari Firebase Realtime Database.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] flex items-center gap-3">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-12 h-16 object-cover rounded-md border border-white/10 shrink-0"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div>
            <h4 className="text-sm font-bold text-[var(--color-text-primary)]">
              {movie.title}
            </h4>
            <p className="text-xs text-[var(--color-text-muted)]">
              Kategori: {movie.category} • ID: {movie.id}
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--color-border-subtle)]">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/5 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all cursor-pointer disabled:opacity-50"
          >
            {deleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Menghapus...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Film</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
