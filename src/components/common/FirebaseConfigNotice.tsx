import React, { useState, useEffect } from 'react';
import { isFirebaseConfigured, getFirebaseConfig, sanitizeDatabaseUrl } from '../../lib/firebase';
import { AlertTriangle, Key, ExternalLink, X, CheckCircle } from 'lucide-react';

import { useAuth } from '../../hooks/useAuth';

export const FirebaseConfigNotice: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const isConfigured = isFirebaseConfigured();
  // Only auto-open if not configured AND either not logged in or is admin
  const [isOpen, setIsOpen] = useState(!isConfigured && (!user || isAdmin));

  const getSaved = () => {
    if (typeof window === 'undefined') return null;
    const item = localStorage.getItem('aurastream_firebase_config');
    if (item) {
      try { return JSON.parse(item); } catch { return null; }
    }
    return null;
  };

  const initial = getSaved();
  const [apiKey, setApiKey] = useState(initial?.apiKey || import.meta.env.VITE_FIREBASE_API_KEY || '');
  const [projectId, setProjectId] = useState(initial?.projectId || import.meta.env.VITE_FIREBASE_PROJECT_ID || '');
  const [databaseUrl, setDatabaseUrl] = useState(initial?.databaseURL || import.meta.env.VITE_FIREBASE_DATABASE_URL || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const handleOpen = () => {
      // Only allow opening if not logged in or if user is admin
      if (!user || isAdmin) {
        setIsOpen(true);
      }
    };
    window.addEventListener('open-firebase-config', handleOpen);
    return () => window.removeEventListener('open-firebase-config', handleOpen);
  }, [user, isAdmin]);

  // If a regular non-admin user is logged in, hide config dialog completely
  if (user && !isAdmin) return null;

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey || !projectId) return;

    const finalDbUrl = sanitizeDatabaseUrl(databaseUrl.trim(), projectId.trim());

    const customConfig = {
      apiKey: apiKey.trim(),
      authDomain: `${projectId.trim()}.firebaseapp.com`,
      databaseURL: finalDbUrl,
      projectId: projectId.trim(),
      storageBucket: `${projectId.trim()}.appspot.com`,
      messagingSenderId: '',
      appId: '1:web:manual'
    };

    localStorage.setItem('aurastream_firebase_config', JSON.stringify(customConfig));
    setSavedSuccess(true);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel max-w-xl w-full p-6 sm:p-8 rounded-2xl border border-[var(--color-gold-primary)]/40 shadow-2xl relative">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] rounded-lg"
          aria-label="Tutup panduan konfigurasi"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-amber-500/10 text-[var(--color-gold-primary)] border border-amber-500/20">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-cinzel text-[var(--color-text-primary)]">
              Konfigurasi Firebase Diperlukan
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Hubungkan aplikasi dengan Firebase Realtime Database & Google Auth
            </p>
          </div>
        </div>

        <div className="text-sm text-[var(--color-text-secondary)] space-y-3 mb-6 bg-[var(--color-bg-secondary)] p-4 rounded-xl border border-[var(--color-border-subtle)]">
          <p>
            Aplikasi membutuhkan Firebase Client Configuration untuk menjalankan <strong>Google Sign-In</strong> dan <strong>Firebase Realtime Database</strong>.
          </p>
          <p className="text-xs">
            Anda dapat mendefinisikannya di file <code>.env</code> atau Vercel Environment Variables:
          </p>
          <ul className="text-xs font-mono list-disc list-inside space-y-1 text-[var(--color-gold-primary)]">
            <li>VITE_FIREBASE_API_KEY</li>
            <li>VITE_FIREBASE_AUTH_DOMAIN</li>
            <li>VITE_FIREBASE_DATABASE_URL</li>
            <li>VITE_FIREBASE_PROJECT_ID</li>
          </ul>
        </div>

        {savedSuccess ? (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 flex items-center gap-2 text-sm">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span>Konfigurasi disimpan! Memuat ulang sistem streaming...</span>
          </div>
        ) : (
          <form onSubmit={handleSaveConfig} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">
                Firebase Web API Key (Wajib)
              </label>
              <input
                type="text"
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border-subtle)] focus:border-[var(--color-gold-primary)] outline-none text-sm text-[var(--color-text-primary)]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">
                Project ID (Wajib)
              </label>
              <input
                type="text"
                placeholder="my-streaming-project"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border-subtle)] focus:border-[var(--color-gold-primary)] outline-none text-sm text-[var(--color-text-primary)]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-1">
                Realtime Database URL (Salin dari Firebase Console)
              </label>
              <input
                type="text"
                placeholder="https://your-project-default-rtdb.asia-southeast1.firebasedatabase.app"
                value={databaseUrl}
                onChange={(e) => setDatabaseUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border-subtle)] focus:border-[var(--color-gold-primary)] outline-none text-sm text-[var(--color-text-primary)] font-mono text-xs"
              />
              <p className="text-[10px] text-[var(--color-text-muted)] mt-1 leading-relaxed">
                Salin URL tepat di bagian atas pohon data Firebase Realtime Database Anda (misal: <code>https://...firebasedatabase.app</code> atau <code>https://...firebaseio.com</code>).
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2.5 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              >
                Lanjutkan Nanti
              </button>
              <button
                type="submit"
                className="gold-button px-5 py-2.5 rounded-xl text-xs font-semibold"
              >
                Simpan & Muat Ulang
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
