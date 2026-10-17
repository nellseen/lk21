import { MovieFormData } from '../types';
import { extractYouTubeId } from './youtube';
import { extractDriveFileId } from './googleDrive';

export interface ValidationErrors {
  title?: string;
  description?: string;
  posterUrl?: string;
  trailerUrl?: string;
  driveUrl?: string;
  category?: string;
}

export function isValidUrl(urlString: string): boolean {
  if (!urlString || typeof urlString !== 'string') return false;
  try {
    const url = new URL(urlString.trim());
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function validateMovieForm(data: MovieFormData): { isValid: boolean; errors: ValidationErrors } {
  const errors: ValidationErrors = {};

  // 1. Title validation
  const title = (data.title || '').trim();
  if (!title) {
    errors.title = 'Judul film wajib diisi.';
  } else if (title.length > 200) {
    errors.title = 'Judul film maksimal 200 karakter.';
  }

  // 2. Description validation
  const description = (data.description || '').trim();
  if (!description) {
    errors.description = 'Deskripsi film wajib diisi.';
  } else if (description.length < 10) {
    errors.description = 'Deskripsi film minimal 10 karakter.';
  } else if (description.length > 5000) {
    errors.description = 'Deskripsi film maksimal 5000 karakter.';
  }

  // 3. Poster URL validation
  const posterUrl = (data.posterUrl || '').trim();
  if (!posterUrl) {
    errors.posterUrl = 'Link poster film wajib diisi.';
  } else if (!isValidUrl(posterUrl)) {
    errors.posterUrl = 'Format URL poster tidak valid. Gunakan format http:// atau https://';
  }

  // 4. Trailer URL validation (optional, but if provided must be valid YouTube)
  const trailerUrl = (data.trailerUrl || '').trim();
  if (trailerUrl) {
    if (!extractYouTubeId(trailerUrl)) {
      errors.trailerUrl = 'Link trailer harus berupa URL YouTube yang valid (youtube.com atau youtu.be).';
    }
  }

  // 5. Drive URL validation (mandatory, must be valid Google Drive file)
  const driveUrl = (data.driveUrl || '').trim();
  if (!driveUrl) {
    errors.driveUrl = 'Link video Google Drive wajib diisi.';
  } else if (!extractDriveFileId(driveUrl)) {
    errors.driveUrl = 'Format link Google Drive tidak valid. Gunakan link file Drive (contoh: https://drive.google.com/file/d/ID/view).';
  }

  // 6. Category validation
  const category = (data.category || '').trim();
  if (!category) {
    errors.category = 'Kategori film wajib dipilih.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
