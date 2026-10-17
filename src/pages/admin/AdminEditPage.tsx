import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MovieForm } from '../../components/admin/MovieForm';
import { getMovieById, updateMovie } from '../../services/movieService';
import { Movie, MovieFormData } from '../../types';
import { ArrowLeft, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

export const AdminEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMovie() {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getMovieById(id);
        if (!data) {
          setError('Film tidak ditemukan di sistem.');
        } else {
          setMovie(data);
        }
      } catch (err: any) {
        setError(err?.message || 'Gagal mengambil data film.');
      } finally {
        setLoading(false);
      }
    }

    loadMovie();
  }, [id]);

  const handleUpdate = async (data: MovieFormData) => {
    if (!id) return;
    await updateMovie(id, data);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg-primary)]">
        <Loader2 className="w-8 h-8 text-[var(--color-gold-primary)] animate-spin" />
        <p className="mt-3 text-xs tracking-widest uppercase text-[var(--color-text-secondary)]">
          Memuat Data Film...
        </p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)] px-4">
        <div className="max-w-md w-full glass-panel p-8 rounded-2xl text-center border border-red-500/30">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold font-cinzel text-[var(--color-text-primary)] mb-2">
            Gagal Memuat Film
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6">
            {error || 'Data film tidak dapat ditemukan untuk diedit.'}
          </p>
          <Link
            to="/admin"
            className="gold-button inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Dashboard Admin
          </Link>
        </div>
      </div>
    );
  }

  const initialFormData: MovieFormData = {
    title: movie.title,
    description: movie.description,
    posterUrl: movie.posterUrl,
    trailerUrl: movie.trailerUrl,
    driveUrl: movie.driveUrl,
    category: movie.category,
    featured: movie.featured
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Navigation */}
        <div className="mb-6">
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-gold-primary)] transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Dashboard Admin</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-gold-primary)] uppercase tracking-widest mb-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Perbarui Data Film</span>
          </div>
          <h1 className="font-cinzel text-3xl font-extrabold text-[var(--color-text-primary)]">
            Ubah Data: {movie.title}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1">
            ID: <span className="font-mono text-[var(--color-gold-primary)]">{movie.id}</span>
          </p>
        </div>

        {/* Form Container */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[var(--color-border-glass)] shadow-2xl">
          <MovieForm
            initialData={initialFormData}
            onSubmit={handleUpdate}
            isEditing={true}
          />
        </div>
      </div>
    </div>
  );
};
