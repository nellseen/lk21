import { 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User 
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../lib/firebase';
import { AuthUser, ADMIN_EMAILS } from '../types';

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
  if (!isFirebaseConfigured() || !auth || !googleProvider) {
    throw new Error('Firebase belum dikonfigurasi. Harap isi variabel konfigurasi Firebase terlebih dahulu.');
  }

  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    };
  } catch (error: any) {
    const code = error?.code || '';
    const message = formatAuthError(code, error?.message);
    const enhancedError = new Error(message);
    (enhancedError as any).code = code;
    throw enhancedError;
  }
}

export async function logoutUser(): Promise<void> {
  if (!auth) return;
  await firebaseSignOut(auth);
}

export function subscribeToAuthState(callback: (user: AuthUser | null) => void): () => void {
  if (!auth) {
    callback(null);
    return () => {};
  }

  return firebaseOnAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      callback({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        emailVerified: firebaseUser.emailVerified
      });
    } else {
      callback(null);
    }
  });
}
