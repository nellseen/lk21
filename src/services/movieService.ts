import { 
  ref, 
  push, 
  set, 
  get, 
  remove, 
  update, 
  onValue, 
  Unsubscribe 
} from 'firebase/database';
import { database, isFirebaseConfigured } from '../lib/firebase';
import { Movie, MovieFormData } from '../types';

function withTimeout<T>(promise: Promise<T>, timeoutMs = 8000, customErrorMessage?: string): Promise<T> {
  let timer: any;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error(
        customErrorMessage || 
        'Koneksi ke Firebase Realtime Database timeout (tidak merespon dalam 8 detik). Pastikan Realtime Database sudah dibuat di Firebase Console dan URL Realtime Database sesuai dengan region (misal: .asia-southeast1.firebasedatabase.app).'
      ));
    }, timeoutMs);
  });

  return Promise.race([
    promise.then((res) => {
      clearTimeout(timer);
      return res;
    }),
    timeoutPromise
  ]);
}

export function subscribeToDatabaseConnection(callback: (connected: boolean) => void): Unsubscribe {
  if (!database) {
    callback(false);
    return () => {};
  }
  const connectedRef = ref(database, '.info/connected');
  return onValue(connectedRef, (snap) => {
    callback(Boolean(snap.val()));
  });
}

export function formatDatabaseError(error: any): string {
  const message = error?.message || '';
  if (message.includes('PERMISSION_DENIED') || error?.code === 'PERMISSION_DENIED') {
    return 'Akses ditolak oleh Firebase Security Rules. Pastikan tab "Rules" di Firebase Realtime Database sudah dipublikasikan sesuai petunjuk dan akun Google Anda adalah administrator yang diizinkan.';
  }
  if (message.includes('NETWORK_ERROR') || message.includes('disconnected')) {
    return 'Koneksi ke Firebase Realtime Database terputus. Mohon periksa jaringan internet Anda.';
  }
  return message || 'Terjadi kesalahan pada operasi database.';
}

export function subscribeToMovies(
  onData: (movies: Movie[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  if (!isFirebaseConfigured() || !database) {
    onData([]);
    if (onError) {
      onError(new Error('Firebase Realtime Database belum dikonfigurasi.'));
    }
    return () => {};
  }

  const moviesRef = ref(database, 'movies');

  return onValue(
    moviesRef,
    (snapshot) => {
      if (!snapshot.exists()) {
        onData([]);
        return;
      }

      const rawData = snapshot.val();
      const list: Movie[] = [];

      Object.keys(rawData).forEach((key) => {
        const item = rawData[key];
        if (item && typeof item === 'object') {
          list.push({
            id: key,
            title: item.title || '',
            description: item.description || '',
            posterUrl: item.posterUrl || '',
            trailerUrl: item.trailerUrl || '',
            driveUrl: item.driveUrl || '',
            category: item.category || 'Action',
            featured: Boolean(item.featured),
            createdAt: Number(item.createdAt) || 0,
            updatedAt: Number(item.updatedAt) || 0
          });
        }
      });

      // Sort by newest first (descending createdAt)
      list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      onData(list);
    },
    (firebaseError) => {
      console.error('Firebase Realtime Database subscription error:', firebaseError);
      const formattedMessage = formatDatabaseError(firebaseError);
      if (onError) {
        onError(new Error(formattedMessage));
      }
    }
  );
}

export async function getMovieById(id: string): Promise<Movie | null> {
  if (!isFirebaseConfigured() || !database) {
    throw new Error('Firebase Database belum diinisialisasi.');
  }

  try {
    const movieRef = ref(database, `movies/${id}`);
    const snapshot = await get(movieRef);

    if (!snapshot.exists()) {
      return null;
    }

    const item = snapshot.val();
    return {
      id,
      title: item.title || '',
      description: item.description || '',
      posterUrl: item.posterUrl || '',
      trailerUrl: item.trailerUrl || '',
      driveUrl: item.driveUrl || '',
      category: item.category || 'Action',
      featured: Boolean(item.featured),
      createdAt: Number(item.createdAt) || 0,
      updatedAt: Number(item.updatedAt) || 0
    };
  } catch (error: any) {
    throw new Error(formatDatabaseError(error));
  }
}

export async function createMovie(data: MovieFormData): Promise<string> {
  if (!isFirebaseConfigured() || !database) {
    throw new Error('Firebase Database belum diinisialisasi.');
  }

  try {
    const moviesRef = ref(database, 'movies');
    const newRef = push(moviesRef);
    const newId = newRef.key;

    if (!newId) {
      throw new Error('Gagal menghasilkan ID unik untuk film.');
    }

    const now = Date.now();
    const moviePayload = {
      title: data.title.trim(),
      description: data.description.trim(),
      posterUrl: data.posterUrl.trim(),
      trailerUrl: (data.trailerUrl || '').trim(),
      driveUrl: data.driveUrl.trim(),
      category: data.category.trim(),
      featured: Boolean(data.featured),
      createdAt: now,
      updatedAt: now
    };

    await withTimeout(
      set(newRef, moviePayload),
      8000,
      'Koneksi ke Firebase Realtime Database timeout (8 detik). Pastikan databaseURL cocok dengan region Firebase (misal: .asia-southeast1.firebasedatabase.app).'
    );
    return newId;
  } catch (error: any) {
    throw new Error(formatDatabaseError(error));
  }
}

export async function updateMovie(id: string, data: MovieFormData): Promise<void> {
  if (!isFirebaseConfigured() || !database) {
    throw new Error('Firebase Database belum diinisialisasi.');
  }

  try {
    const movieRef = ref(database, `movies/${id}`);
    const now = Date.now();
    const updatePayload = {
      title: data.title.trim(),
      description: data.description.trim(),
      posterUrl: data.posterUrl.trim(),
      trailerUrl: (data.trailerUrl || '').trim(),
      driveUrl: data.driveUrl.trim(),
      category: data.category.trim(),
      featured: Boolean(data.featured),
      updatedAt: now
    };

    await withTimeout(
      update(movieRef, updatePayload),
      8000,
      'Koneksi ke Firebase Realtime Database timeout (8 detik) saat memperbarui film.'
    );
  } catch (error: any) {
    throw new Error(formatDatabaseError(error));
  }
}

export async function deleteMovie(id: string): Promise<void> {
  if (!isFirebaseConfigured() || !database) {
    throw new Error('Firebase Database belum diinisialisasi.');
  }

  try {
    const movieRef = ref(database, `movies/${id}`);
    await withTimeout(
      remove(movieRef),
      8000,
      'Koneksi ke Firebase Realtime Database timeout (8 detik) saat menghapus film.'
    );
  } catch (error: any) {
    throw new Error(formatDatabaseError(error));
  }
}
