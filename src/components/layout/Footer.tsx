import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Shield, Lock, Play, Github } from 'lucide-react';
import { ADMIN_EMAIL } from '../../types';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)] pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center shadow-lg">
                <Film className="w-4 h-4 text-black" />
              </div>
              <span className="font-cinzel text-xl font-bold tracking-widest gold-gradient-text">
                AURASTREAM <span className="text-xs font-sans tracking-normal opacity-70">CINEMA</span>
              </span>
            </Link>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed max-w-md">
              Platform kurasi film eksklusif berdefinisi tinggi yang dirancang dengan estetika sinematik premium. Terintegrasi penuh dengan Firebase Realtime Database dan Google Drive video player.
            </p>
            <div className="flex items-center gap-4 text-xs text-[var(--color-text-muted)] pt-2">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[var(--color-gold-primary)]" />
                Firebase Protected
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[var(--color-gold-primary)]" />
                Google Authenticated
              </span>
            </div>
          </div>

          {/* Nav Col */}
          <div>
            <h4 className="font-cinzel text-xs font-bold uppercase tracking-widest text-[var(--color-gold-primary)] mb-4">
              Navigasi Cepat
            </h4>
            <ul className="space-y-2.5 text-xs text-[var(--color-text-secondary)]">
              <li>
                <Link to="/" className="hover:text-[var(--color-gold-primary)] transition-colors">
                  Beranda Utama
                </Link>
              </li>
              <li>
                <Link to="/browse" className="hover:text-[var(--color-gold-primary)] transition-colors">
                  Jelajahi Katalog
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-[var(--color-gold-primary)] transition-colors">
                  Pencarian Film
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-[var(--color-gold-primary)] transition-colors">
                  Studio Administrator
                </Link>
              </li>
            </ul>
          </div>

          {/* Admin Policy Col */}
          <div>
            <h4 className="font-cinzel text-xs font-bold uppercase tracking-widest text-[var(--color-gold-primary)] mb-4">
              Otoritas Sistem
            </h4>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-3">
              Hak kelola konten dan operasi CRUD database dibatasi secara ketat pada Firebase Security Rules untuk:
            </p>
            <div className="bg-[var(--color-bg-elevated)] p-2.5 rounded-lg border border-[var(--color-border-subtle)] text-[11px] font-mono text-[var(--color-gold-primary)] break-all select-all">
              {ADMIN_EMAIL}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[var(--color-border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--color-text-muted)]">
          <p>© {new Date().getFullYear()} AuraStream Cinema. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-4">
            <span>Powered by React 19 + Firebase + Vite + Vercel</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
