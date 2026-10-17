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

// Retrieve config from Vite environment variables or localStorage fallback for preview setups
export function getFirebaseConfig(): FirebaseClientConfig | null {
  const envApiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const envAuthDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
  const envDatabaseURL = import.meta.env.VITE_FIREBASE_DATABASE_URL;
  const envProjectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  const envAppId = import.meta.env.VITE_FIREBASE_APP_ID;

  if (envApiKey && envProjectId) {
    return {
      apiKey: envApiKey,
      authDomain: envAuthDomain || `${envProjectId}.firebaseapp.com`,
      databaseURL: envDatabaseURL || `https://${envProjectId}-default-rtdb.firebaseio.com`,
      projectId: envProjectId,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || `${envProjectId}.appspot.com`,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: envAppId || ''
    };
  }

  // Check localStorage if user configured it in the UI helper
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('aurastream_firebase_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.apiKey && parsed.projectId) {
          return parsed;
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
    database = getDatabase(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });
  } catch (error) {
    console.error('Failed to initialize Firebase with provided config:', error);
  }
}

export function isFirebaseConfigured(): boolean {
  return !!(auth && database);
}

export { app, auth, database, googleProvider };
