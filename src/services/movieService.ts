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

// Default mock cinema catalog for instant preview & zero-setup environment
const DEFAULT_MOVIES: Movie[] = [
  {
    id: 'movie-dune-2',
    title: 'Dune: Part Two',
    description: 'Paul Atreides bersatu dengan Chani dan kaum Fremen sambil membalas dendam terhadap para konspirator yang menghancurkan keluarganya. Menghadapi pilihan antara cinta dalam hidupnya dan nasib alam semesta, ia bertekad mencegah masa depan mengerikan yang hanya ia yang bisa lihat.',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
    driveUrl: 'https://drive.google.com/file/d/1a2b3c4d5e6f7g8h9i0jklmnopqr/view',
    category: 'Sci-Fi',
    featured: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 2
  },
  {
    id: 'movie-oppenheimer',
    title: 'Oppenheimer',
    description: 'Kisah fisikawan Amerika J. Robert Oppenheimer, kepala Laboratorium Los Alamos selama Perang Dunia II dan perannya dalam Proyek Manhattan yang menghasilkan bom atom pertama di dunia yang mengubah jalannya peradaban manusia selamanya.',
    posterUrl: 'https://images.unsplash.com/photo-1578836537282-3171d77f8632?auto=format&fit=crop&w=800&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=uYPbbksJxIg',
    driveUrl: 'https://drive.google.com/file/d/1b2c3d4e5f6g7h8i9j0klmnopqrs/view',
    category: 'Drama',
    featured: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 4,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 4
  },
  {
    id: 'movie-the-batman',
    title: 'The Batman',
    description: 'Ketika seorang pembunuh berantai misterius yang menargetkan para elit politik Gotham mulai beraksi, penyelidikan rahasia memaksa Sang Ksatria Kegelapan menjelajahi dunia bawah kota dan mengungkap korupsi yang mengakar kuat di Gotham City.',
    posterUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=800&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=mqqft2x_Aa4',
    driveUrl: 'https://drive.google.com/file/d/1c2d3e4f5g6h7i8j9k0lmnopqrst/view',
    category: 'Action',
    featured: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 6,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 6
  },
  {
    id: 'movie-spider-verse',
    title: 'Spider-Man: Across the Spider-Verse',
    description: 'Miles Morales melontarkan diri melintasi Multiverse, tempat ia bertemu dengan Spider-Society yang bertugas melindungi jalannya waktu. Saat para pahlawan berselisih cara menangani ancaman baru, Miles harus mendefinisikan ulang artinya menjadi pahlawan.',
    posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=800&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=cqGjhVJWtEg',
    driveUrl: 'https://drive.google.com/file/d/1e2f3g4h5i6j7k8l9m0nopqrstuvw/view',
    category: 'Animation',
    featured: true,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 8,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 8
  },
  {
    id: 'movie-interstellar',
    title: 'Interstellar',
    description: 'Ketika bumi menghadapi kepunahan akibat kegagalan panen global, sekelompok penjelajah melintasi lubang cacing di luar angkasa dalam upaya putus asa untuk mencari tempat tinggal baru bagi kelangsungan hidup umat manusia.',
    posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    driveUrl: 'https://drive.google.com/file/d/1d2e3f4g5h6i7j8k9l0mnopqrstuv/view',
    category: 'Sci-Fi',
    featured: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 10
  },
  {
    id: 'movie-top-gun-maverick',
    title: 'Top Gun: Maverick',
    description: 'Setelah lebih dari tiga puluh tahun mengabdi sebagai penerbang top Angkatan Laut, Pete Maverick Mitchell kembali ke tempat latihan untuk melatih detasemen lulusan elit untuk misi berisiko tinggi yang belum pernah ada.',
    posterUrl: 'https://images.unsplash.com/photo-1519074069444-1ba4e3a4794e?auto=format&fit=crop&w=800&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=giXco2jaZ_4',
    driveUrl: 'https://drive.google.com/file/d/1f2g3h4i5j6k7l8m9n0opqrstuvwx/view',
    category: 'Action',
    featured: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 12,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 12
  },
  {
    id: 'movie-a-quiet-place',
    title: 'A Quiet Place: Day One',
    description: 'Saksikan hari pertama ketika dunia menjadi hening seketika saat makhluk asing buta berkecepatan tinggi dengan pendengaran ultrasonik menyerbu kota New York.',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    trailerUrl: 'https://www.youtube.com/watch?v=YPY7J-flzE8',
    driveUrl: 'https://drive.google.com/file/d/1h2i3j4k5l6m7n8o9p0qrstuvwxyz/view',
    category: 'Horror',
    featured: false,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 14,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 14
  }
];

const LOCAL_STORAGE_KEY = 'aurastream_mock_movies';

// In-memory / localStorage store management
function getLocalMovies(): Movie[] {
  if (typeof window === 'undefined') return [...DEFAULT_MOVIES];
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    // Initialize default seed
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_MOVIES));
    return [...DEFAULT_MOVIES];
  } catch {
    return [...DEFAULT_MOVIES];
  }
}

function saveLocalMovies(movies: Movie[]): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(movies));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }
}

// Reactive listeners for mock store
const mockSubscribers = new Set<(movies: Movie[]) => void>();

function notifyMockSubscribers() {
  const current = getLocalMovies();
  // Sort desc by createdAt
  current.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  mockSubscribers.forEach((cb) => cb(current));
}

function withTimeout<T>(promise: Promise<T>, timeoutMs = 8000, customErrorMessage?: string): Promise<T> {
  let timer: any;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error(
        customErrorMessage || 
        'Koneksi ke Firebase Realtime Database timeout (tidak merespon dalam 8 detik).'
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
  if (!isFirebaseConfigured() || !database) {
    // In local storage mode, connection is always healthy
    callback(true);
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
    return 'Akses ditolak oleh Firebase Security Rules. Pastikan tab "Rules" di Firebase Realtime Database sudah dipublikasikan sesuai petunjuk.';
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
  // If Firebase is configured and active, use Firebase Realtime Database
  if (isFirebaseConfigured() && database) {
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

        list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        onData(list);
      },
      (firebaseError: any) => {
        console.warn('Firebase RTDB error, falling back to local catalog store:', firebaseError);
        // Resilient fallback to local storage
        const local = getLocalMovies();
        local.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        onData(local);
        if (onError) {
          onError(new Error(formatDatabaseError(firebaseError)));
        }
      }
    );
  }

  // Graceful fallback to local in-memory/localStorage store
  const current = getLocalMovies();
  current.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  onData(current);

  mockSubscribers.add(onData);
  return () => {
    mockSubscribers.delete(onData);
  };
}

export async function getMovieById(id: string): Promise<Movie | null> {
  if (isFirebaseConfigured() && database) {
    try {
      const movieRef = ref(database, `movies/${id}`);
      const snapshot = await get(movieRef);

      if (snapshot.exists()) {
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
      }
    } catch (error) {
      console.warn('Firebase getMovieById failed, checking local store:', error);
    }
  }

  // Fallback to local store
  const localList = getLocalMovies();
  const found = localList.find((m) => m.id === id);
  return found || null;
}

export async function createMovie(data: MovieFormData): Promise<string> {
  const now = Date.now();

  if (isFirebaseConfigured() && database) {
    try {
      const moviesRef = ref(database, 'movies');
      const newRef = push(moviesRef);
      const newId = newRef.key;

      if (!newId) {
        throw new Error('Gagal menghasilkan ID unik untuk film.');
      }

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
        'Koneksi ke Firebase Realtime Database timeout.'
      );
      return newId;
    } catch (error: any) {
      console.warn('Firebase createMovie error, falling back to local store:', error);
    }
  }

  // Local storage CRUD fallback
  const localList = getLocalMovies();
  const newId = `movie-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const newMovie: Movie = {
    id: newId,
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

  localList.unshift(newMovie);
  saveLocalMovies(localList);
  notifyMockSubscribers();
  return newId;
}

export async function updateMovie(id: string, data: MovieFormData): Promise<void> {
  const now = Date.now();

  if (isFirebaseConfigured() && database) {
    try {
      const movieRef = ref(database, `movies/${id}`);
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
        'Koneksi ke Firebase Realtime Database timeout.'
      );
      return;
    } catch (error: any) {
      console.warn('Firebase updateMovie error, falling back to local store:', error);
    }
  }

  // Local storage fallback
  const localList = getLocalMovies();
  const index = localList.findIndex((m) => m.id === id);
  if (index !== -1) {
    localList[index] = {
      ...localList[index],
      title: data.title.trim(),
      description: data.description.trim(),
      posterUrl: data.posterUrl.trim(),
      trailerUrl: (data.trailerUrl || '').trim(),
      driveUrl: data.driveUrl.trim(),
      category: data.category.trim(),
      featured: Boolean(data.featured),
      updatedAt: now
    };
    saveLocalMovies(localList);
    notifyMockSubscribers();
  }
}

export async function deleteMovie(id: string): Promise<void> {
  if (isFirebaseConfigured() && database) {
    try {
      const movieRef = ref(database, `movies/${id}`);
      await withTimeout(
        remove(movieRef),
        8000,
        'Koneksi ke Firebase Realtime Database timeout saat menghapus film.'
      );
      return;
    } catch (error: any) {
      console.warn('Firebase deleteMovie error, falling back to local store:', error);
    }
  }

  // Local storage fallback
  const localList = getLocalMovies();
  const updated = localList.filter((m) => m.id !== id);
  saveLocalMovies(updated);
  notifyMockSubscribers();
}
