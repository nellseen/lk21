import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ShieldAlert, ArrowLeft, Film } from 'lucide-react';
import { ADMIN_EMAIL } from '../../types';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg-primary)] px-4">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-2 border-[var(--color-border-glass)] border-t-[var(--color-gold-primary)] rounded-full animate-spin" />
          <Film className="w-6 h-6 text-[var(--color-gold-primary)] absolute" />
        </div>
        <p className="mt-4 text-sm font-medium tracking-widest uppercase text-[var(--color-text-secondary)]">
          Memeriksa Izin Administrator...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)] px-4 py-16">
        <div className="max-w-lg w-full glass-panel p-8 rounded-2xl text-center border border-red-500/20 shadow-2xl">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/30">
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold font-cinzel mb-2 text-[var(--color-text-primary)]">
            Akses Panel Admin Ditolak
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6 leading-relaxed">
            Akun Anda (<strong className="text-[var(--color-text-primary)]">{user.email}</strong>) terdaftar sebagai penonton. Panel pengelolaan konten hanya dapat diakses oleh email administrator resmi:
          </p>
          <div className="bg-[var(--color-bg-secondary)] px-4 py-3 rounded-lg border border-[var(--color-border-subtle)] text-xs font-mono text-[var(--color-gold-primary)] mb-8 select-all">
            {ADMIN_EMAIL}
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 gold-button px-6 py-3 rounded-xl text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda Sinema
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
