export interface Movie {
  id: string;
  title: string;
  description: string;
  posterUrl: string;
  trailerUrl: string;
  driveUrl: string;
  category: string;
  featured: boolean;
  createdAt: number;
  updatedAt: number;
}

export type MovieFormData = {
  title: string;
  description: string;
  posterUrl: string;
  trailerUrl: string;
  driveUrl: string;
  category: string;
  featured: boolean;
};

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

export type ThemeMode = 'dark' | 'light';

export const MOVIE_CATEGORIES = [
  'Action',
  'Drama',
  'Sci-Fi',
  'Thriller',
  'Horror',
  'Romance',
  'Comedy',
  'Adventure',
  'Animation',
  'Documentary',
  'Mystery',
  'Fantasy'
] as const;

export type MovieCategory = typeof MOVIE_CATEGORIES[number];

export const ADMIN_EMAIL = 'cristiandwihariantoro@gmail.com';
