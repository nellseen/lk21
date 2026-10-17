import React from 'react';
import { Link } from 'react-router-dom';
import { MovieForm } from '../../components/admin/MovieForm';
import { createMovie } from '../../services/movieService';
import { MovieFormData } from '../../types';
import { ArrowLeft, Film, ShieldCheck } from 'lucide-react';

export const AdminUploadPage: React.FC = () => {
  const handleUpload = async (data: MovieFormData) => {
    await createMovie(data);
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
            <span>Formulir Pengunggahan</span>
          </div>
          <h1 className="font-cinzel text-3xl font-extrabold text-[var(--color-text-primary)]">
            Tambah Film Baru ke Katalog
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1">
            Lengkapi informasi film, link poster resolusi tinggi, video Google Drive, serta trailer YouTube.
          </p>
        </div>

        {/* Form Container */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[var(--color-border-glass)] shadow-2xl">
          <MovieForm onSubmit={handleUpload} isEditing={false} />
        </div>
      </div>
    </div>
  );
};
