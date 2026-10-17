import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useMovies } from '../../hooks/useMovies';
import { deleteMovie } from '../../services/movieService';
import { DeleteConfirmModal } from '../../components/admin/DeleteConfirmModal';
import { Badge } from '../../components/common/Badge';
import { Movie } from '../../types';
import { 
  Plus, 
  Film, 
  Sparkles, 
  FolderCheck, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  ShieldCheck, 
  ExternalLink,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { movies, loading, error } = useMovies();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovieForDelete, setSelectedMovieForDelete] = useState<Movie | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Derived metrics
  const totalMovies = movies.length;
  const totalFeatured = movies.filter((m) => m.featured).length;
  const categoriesCount = useMemo(() => {
    return new Set(movies.map((m) => m.category)).size;
  }, [movies]);

  const filteredMovies = useMemo(() => {
    if (!searchQuery.trim()) return movies;
    const q = searchQuery.toLowerCase().trim();
    return movies.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q)
    );
  }, [movies, searchQuery]);

  const handleDeleteConfirm = async (movieId: string) => {
    setActionError(null);
    try {
      await deleteMovie(movieId);
    } catch (err: any) {
      setActionError(err?.message || 'Gagal menghapus film.');
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-gold-primary)] uppercase tracking-widest mb-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Studio Administrator</span>
            </div>
            <h1 className="font-cinzel text-3xl sm:text-4xl font-extrabold text-[var(--color-text-primary)]">
              Pengelolaan Katalog Sinema
            </h1>
            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1">
              Pusat kendali konten resmi AuraStream Cinema. Tambah, perbarui, dan kelola film di Realtime Database.
            </p>
          </div>

          <Link
            to="/admin/upload"
            className="gold-button px-5 py-3 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xl hover:scale-105 transition-transform shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Film Baru</span>
          </Link>
        </div>

        {/* Action Error Banner */}
        {actionError && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{actionError}</span>
          </div>
        )}

        {/* Analytics & Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {/* 1. Total Movies */}
          <div className="glass-panel p-6 rounded-2xl border border-[var(--color-border-subtle)] flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                Total Film
              </p>
              <h3 className="font-cinzel text-3xl font-black text-[var(--color-text-primary)] mt-1">
                {totalMovies}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-[var(--color-gold-primary)] flex items-center justify-center">
              <Film className="w-6 h-6" />
            </div>
          </div>

          {/* 2. Total Featured */}
          <div className="glass-panel p-6 rounded-2xl border border-[var(--color-border-subtle)] flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                Film Unggulan
              </p>
              <h3 className="font-cinzel text-3xl font-black text-[var(--color-text-primary)] mt-1">
                {totalFeatured}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 text-yellow-400 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>

          {/* 3. Categories Active */}
          <div className="glass-panel p-6 rounded-2xl border border-[var(--color-border-subtle)] flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                Kategori Aktif
              </p>
              <h3 className="font-cinzel text-3xl font-black text-[var(--color-text-primary)] mt-1">
                {categoriesCount}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <FolderCheck className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Content Management Table Section */}
        <div className="glass-panel rounded-2xl border border-[var(--color-border-glass)] shadow-2xl overflow-hidden">
          {/* Search / Filter Bar */}
          <div className="p-4 sm:p-5 border-b border-[var(--color-border-subtle)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" />
              <input
                type="text"
                placeholder="Cari judul film atau kategori..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-subtle)] text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-gold-primary)]"
              />
            </div>

            <div className="text-xs text-[var(--color-text-muted)]">
              Menampilkan {filteredMovies.length} dari {totalMovies} film
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[var(--color-text-secondary)]">
              <thead className="bg-[var(--color-bg-secondary)] uppercase tracking-wider font-semibold text-[var(--color-text-muted)] border-b border-[var(--color-border-subtle)]">
                <tr>
                  <th scope="col" className="px-6 py-4">Poster & Judul</th>
                  <th scope="col" className="px-6 py-4">Kategori</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                  <th scope="col" className="px-6 py-4">Tanggal Rilis</th>
                  <th scope="col" className="px-6 py-4 text-right">Aksi Kelola</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border-subtle)]">
                {filteredMovies.map((movie) => (
                  <tr
                    key={movie.id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    {/* Poster & Title */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={movie.posterUrl}
                          alt={movie.title}
                          className="w-10 h-14 object-cover rounded-md border border-[var(--color-border-subtle)] shrink-0"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div className="max-w-xs sm:max-w-sm">
                          <span className="font-bold text-sm text-[var(--color-text-primary)] block truncate">
                            {movie.title}
                          </span>
                          <span className="text-[10px] text-[var(--color-text-muted)] font-mono">
                            ID: {movie.id.slice(0, 14)}...
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      <Badge variant="category">{movie.category}</Badge>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {movie.featured ? (
                        <Badge variant="featured" className="text-[10px]">
                          <Sparkles className="w-3 h-3 mr-1 inline" />
                          Unggulan
                        </Badge>
                      ) : (
                        <span className="text-[11px] text-[var(--color-text-muted)]">
                          Standar
                        </span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(movie.createdAt).toLocaleDateString('id-ID')}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/movie/${movie.id}`}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                          title="Lihat Pratinjau Film"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          to={`/admin/edit/${movie.id}`}
                          className="p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-[var(--color-gold-primary)] transition-colors"
                          title="Ubah Data Film"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => setSelectedMovieForDelete(movie)}
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                          title="Hapus Film"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredMovies.length === 0 && (
            <div className="p-8 text-center text-xs text-[var(--color-text-muted)]">
              {searchQuery
                ? `Tidak ada film yang cocok dengan pencarian "${searchQuery}".`
                : 'Belum ada film di katalog. Silakan klik "Tambah Film Baru" untuk menambahkan.'}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        movie={selectedMovieForDelete}
        isOpen={Boolean(selectedMovieForDelete)}
        onClose={() => setSelectedMovieForDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};
