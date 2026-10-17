import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import { getDatabase, Database } from 'firebase/database';

export interface FirebaseClientConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
}

/**
 * Normalizes and sanitizes Firebase Realtime Database URL to prevent
 * "FIREBASE FATAL ERROR: Cannot parse Firebase url"
 */
export function sanitizeDatabaseUrl(url: string | undefined | null, projectId: string): string {
  const defaultUrl = `https://${projectId}-default-rtdb.firebaseio.com`;
  if (!url || typeof url !== 'string') {
    return defaultUrl;
  }

  let cleaned = url.trim();

  // If user pasted a Firebase Console URL (e.g. .../project/PROJ/database/DB_NAME/data...)
  if (cleaned.includes('console.firebase.google.com')) {
    const dbMatch = cleaned.match(/\/database\/([^\/\?#]+)/);
    if (dbMatch && dbMatch[1]) {
      cleaned = `https://${dbMatch[1]}.firebaseio.com`;
    } else {
      return defaultUrl;
    }
  }

  // Remove any query params or trailing slashes
  cleaned = cleaned.split('?')[0].split('#')[0].replace(/\/+$/, '');

  // Ensure protocol
  if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
    cleaned = `https://${cleaned}`;
  }

  try {
    const parsed = new URL(cleaned);
    const host = parsed.hostname.toLowerCase();

    // Check valid Firebase RTDB domains
    if (host.endsWith('.firebaseio.com') || host.endsWith('.firebasedatabase.app')) {
      return `https://${host}`;
    }

    if (host === 'localhost' || host === '127.0.0.1') {
      return `${parsed.protocol}//${parsed.host}`;
    }

    // If user provided just an alphanumeric identifier as host
    if (/^[a-zA-Z0-9-]+$/.test(host)) {
      return `https://${host}.firebaseio.com`;
    }

    return defaultUrl;
  } catch {
    return defaultUrl;
  }
}

// Retrieve config from Vite environment variables or localStorage fallback for preview setups
export function getFirebaseConfig(): FirebaseClientConfig | null {
  const envApiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const envAuthDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
  const envDatabaseURL = import.meta.env.VITE_FIREBASE_DATABASE_URL;
  const envProjectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  const envAppId = import.meta.env.VITE_FIREBASE_APP_ID;

  if (envApiKey && envProjectId) {
    return {
      apiKey: envApiKey.trim(),
      authDomain: envAuthDomain ? envAuthDomain.trim() : `${envProjectId.trim()}.firebaseapp.com`,
      databaseURL: sanitizeDatabaseUrl(envDatabaseURL, envProjectId.trim()),
      projectId: envProjectId.trim(),
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || `${envProjectId.trim()}.appspot.com`,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: envAppId ? envAppId.trim() : ''
    };
  }

  // Check localStorage if user configured it in the UI helper
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('aurastream_firebase_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.apiKey && parsed.projectId) {
          const proj = parsed.projectId.trim();
          return {
            apiKey: parsed.apiKey.trim(),
            authDomain: parsed.authDomain || `${proj}.firebaseapp.com`,
            databaseURL: sanitizeDatabaseUrl(parsed.databaseURL, proj),
            projectId: proj,
            storageBucket: parsed.storageBucket || `${proj}.appspot.com`,
            messagingSenderId: parsed.messagingSenderId || '',
            appId: parsed.appId || '1:web:manual'
          };
        }
      } catch {
        // ignore parse error
      }
    }
  }

  return null;
}

const firebaseConfig = getFirebaseConfig();

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let database: Database | null = null;
let googleProvider: GoogleAuthProvider | null = null;

if (firebaseConfig && firebaseConfig.apiKey) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });

    // Safely initialize database with sanitization and graceful fallback
    try {
      database = getDatabase(app, firebaseConfig.databaseURL);
    } catch (dbErr) {
      console.warn('Direct database URL initialization failed, attempting app default fallback:', dbErr);
      try {
        database = getDatabase(app);
      } catch (fallbackErr) {
        console.error('All database initialization attempts failed:', fallbackErr);
      }
    }
  } catch (error) {
    console.error('Failed to initialize Firebase with provided config:', error);
  }
}

export function isFirebaseConfigured(): boolean {
  return !!(auth && database);
}

export { app, auth, database, googleProvider };
