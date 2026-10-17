import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Film, Shield, AlertCircle, Loader2, UserCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { isFirebaseConfigured } from '../lib/firebase';
import { ADMIN_EMAIL } from '../types';

export const LoginPage: React.FC = () => {
  const { user, loading, login, loginAsViewer, error, clearError } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  // If already logged in, redirect to target or home
  const from = (location.state as any)?.from?.pathname || '/';

  useEffect(() => {
    if (user && !loading) {
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, from]);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setLocalError(null);
    clearError();

    try {
      await login();
      // On success, useEffect will redirect
    } catch (err: any) {
      setLocalError(err?.message || 'Login gagal. Silakan coba kembali.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleViewerLogin = async () => {
    setIsLoggingIn(true);
    setLocalError(null);
    clearError();

    try {
      await loginAsViewer();
    } catch (err: any) {
      setLocalError(err?.message || 'Login penonton gagal.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)]">
        <Loader2 className="w-8 h-8 text-[var(--color-gold-primary)] animate-spin" />
      </div>
    );
  }

  const isConfigured = isFirebaseConfigured();

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-12 overflow-hidden bg-black">
      {/* Cinematic Background Backdrop */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=2000&q=80"
          alt="Cinema Backdrop"
          className="w-full h-full object-cover opacity-25 filter brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-primary)] via-black/80 to-[var(--color-bg-primary)]/90" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/60 to-[var(--color-bg-primary)]" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 max-w-md w-full glass-panel p-8 sm:p-10 rounded-3xl border border-[var(--color-border-glass)] shadow-2xl backdrop-blur-2xl text-center">
        {/* Brand Emblem */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center shadow-xl shadow-amber-500/25 mb-6">
          <Film className="w-8 h-8 text-black" />
        </div>

        <h1 className="font-cinzel text-3xl font-black text-white tracking-wider mb-2">
          AURA<span className="gold-gradient-text">STREAM</span>
        </h1>
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-gold-primary)] font-semibold mb-6">
          Cinema Exclusive Sanctuary
        </p>

        <p className="text-sm text-zinc-300 leading-relaxed mb-6">
          Akses seluruh katalog film sinematik eksklusif, trailer resmi, dan streaming Google Drive berkecepatan tinggi.
        </p>

        {!isConfigured && (
          <div className="mb-6 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs text-left flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Mode Demo / Pratinjau Aktif:</strong> Klik tombol masuk di bawah untuk langsung mencoba panel administrator secara instan.
            </p>
          </div>
        )}

        {/* Error Notice */}
        {(localError || error) && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs text-left flex items-start gap-3 animate-fadeIn">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Autentikasi Gagal</span>
              <p className="mt-0.5 leading-relaxed">{localError || error}</p>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleGoogleLogin}
            disabled={isLoggingIn}
            className="w-full py-3.5 px-6 rounded-2xl bg-white hover:bg-zinc-100 text-zinc-900 font-bold text-sm flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer disabled:opacity-50 active:scale-[0.98]"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="w-5 h-5 text-amber-600 animate-spin" />
                <span>Memproses Masuk...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Masuk sebagai Administrator</span>
              </>
            )}
          </button>

          <button
            onClick={handleViewerLogin}
            disabled={isLoggingIn}
            className="w-full py-3 px-6 rounded-2xl glass-card hover:border-[var(--color-border-glass)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <UserCheck className="w-4 h-4 text-[var(--color-gold-primary)]" />
            <span>Masuk sebagai Tamu / Penonton</span>
          </button>
        </div>

        {/* Security & Policy Assurance */}
        <div className="mt-8 pt-6 border-t border-white/10 space-y-2">
          <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-400">
            <Shield className="w-3.5 h-3.5 text-[var(--color-gold-primary)]" />
            <span>Autentikasi Terenkripsi</span>
          </div>
          <p className="text-[10px] text-zinc-500">
            Hak admin otomatis diberikan kepada <code className="text-amber-400/90">{ADMIN_EMAIL}</code>
          </p>
        </div>
      </div>
    </div>
  );
};
