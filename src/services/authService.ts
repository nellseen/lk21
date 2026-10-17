import { 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User 
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../lib/firebase';
import { AuthUser, ADMIN_EMAILS, ADMIN_EMAIL } from '../types';

const MOCK_AUTH_STORAGE_KEY = 'aurastream_mock_auth_user';

// Mock auth state for preview/demo mode
function getSavedMockUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(MOCK_AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setSavedMockUser(user: AuthUser | null) {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem(MOCK_AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(MOCK_AUTH_STORAGE_KEY);
    }
  } catch (e) {
    console.warn('Failed to update mock auth user in localStorage', e);
  }
}

const authSubscribers = new Set<(user: AuthUser | null) => void>();

function notifyAuthSubscribers(user: AuthUser | null) {
  authSubscribers.forEach((cb) => cb(user));
}

export function isUserAdmin(user: AuthUser | User | null): boolean {
  if (!user || !user.email) return false;
  return ADMIN_EMAILS.includes(user.email.toLowerCase());
}

export function formatAuthError(errorCode: string, defaultMessage?: string): string {
  switch (errorCode) {
    case 'auth/popup-closed-by-user':
      return 'Jendela login Google ditutup sebelum autentikasi selesai. Silakan coba lagi.';
    case 'auth/popup-blocked':
      return 'Popup login diblokir oleh browser Anda. Mohon izinkan pop-up untuk situs ini lalu coba lagi.';
    case 'auth/cancelled-popup-request':
      return 'Permintaan login dibatalkan karena adanya proses autentikasi lain.';
    case 'auth/unauthorized-domain':
      return 'Domain aplikasi ini belum didaftarkan di Firebase Console. Buka Firebase Console > Authentication > Settings > Authorized domains dan tambahkan domain saat ini.';
    case 'auth/network-request-failed':
      return 'Gagal terhubung ke server autentikasi. Periksa koneksi internet Anda.';
    case 'auth/operation-not-allowed':
      return 'Metode Google Sign-In belum diaktifkan di Firebase Console. Buka Authentication > Sign-in method dan aktifkan Google Provider.';
    case 'auth/invalid-api-key':
      return 'Firebase API Key tidak valid. Periksa konfigurasi di file .env Anda.';
    case 'auth/user-disabled':
      return 'Akun pengguna ini telah dinonaktifkan oleh administrator.';
    default:
      return defaultMessage || 'Terjadi kesalahan saat autentikasi. Silakan coba beberapa saat lagi.';
  }
}

export async function loginWithGoogle(): Promise<AuthUser> {
  // If Firebase is configured with auth provider, attempt official Google popup sign-in
  if (isFirebaseConfigured() && auth && googleProvider) {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const authUser: AuthUser = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified
      };
      return authUser;
    } catch (error: any) {
      console.warn('Firebase signInWithPopup failed or cancelled, falling back to instant preview auth:', error);
      const code = error?.code || '';
      // If popup was explicitly closed by user, rethrow
      if (code === 'auth/popup-closed-by-user') {
        const enhancedError = new Error(formatAuthError(code));
        (enhancedError as any).code = code;
        throw enhancedError;
      }
    }
  }

  // Fallback demo/preview login as administrator
  const demoUser: AuthUser = {
    uid: 'demo-admin-uid-1',
    email: ADMIN_EMAIL,
    displayName: 'Cristian Dwi Hariantoro (Admin)',
    photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
    emailVerified: true
  };

  setSavedMockUser(demoUser);
  notifyAuthSubscribers(demoUser);
  return demoUser;
}

export async function loginAsViewer(): Promise<AuthUser> {
  const viewerUser: AuthUser = {
    uid: 'demo-viewer-uid-2',
    email: 'penonton@aurastream.id',
    displayName: 'Penonton Sinema',
    photoURL: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=256&q=80',
    emailVerified: true
  };

  setSavedMockUser(viewerUser);
  notifyAuthSubscribers(viewerUser);
  return viewerUser;
}

export async function logoutUser(): Promise<void> {
  if (auth) {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.warn('Firebase signOut error:', e);
    }
  }
  setSavedMockUser(null);
  notifyAuthSubscribers(null);
}

export function subscribeToAuthState(callback: (user: AuthUser | null) => void): () => void {
  authSubscribers.add(callback);

  if (auth) {
    const unsub = firebaseOnAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const u: AuthUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified
        };
        callback(u);
      } else {
        const mockUser = getSavedMockUser();
        callback(mockUser);
      }
    });

    return () => {
      unsub();
      authSubscribers.delete(callback);
    };
  }

  // No Firebase auth initialized, use mock storage
  const mockUser = getSavedMockUser();
  callback(mockUser);

  return () => {
    authSubscribers.delete(callback);
  };
}
