import React from 'react';
import { Link } from 'react-router-dom';
import { Film, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)] px-4">
      <div className="max-w-md w-full glass-panel p-8 sm:p-10 rounded-3xl text-center border border-[var(--color-border-glass)] shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-[var(--color-gold-primary)] flex items-center justify-center mx-auto mb-6">
          <Film className="w-8 h-8" />
        </div>
        <h1 className="font-cinzel text-5xl font-black text-white mb-2">404</h1>
        <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-3">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-xs text-[var(--color-text-secondary)] mb-8 leading-relaxed">
          Tampaknya rute atau halaman yang Anda cari tidak tersedia dalam arsip sinema.
        </p>
        <Link
          to="/"
          className="gold-button inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda Utama</span>
        </Link>
      </div>
    </div>
  );
};
