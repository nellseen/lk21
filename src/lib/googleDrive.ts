/**
 * Google Drive URL Parser & Video Embed Utility
 * Supports patterns:
 * - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * - https://drive.google.com/file/d/FILE_ID/preview
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/uc?id=FILE_ID
 * - Raw file ID (alphanumeric, dashes, underscores, length typically 25-45)
 */

export interface GoogleDriveParseResult {
  isValid: boolean;
  fileId: string | null;
  embedUrl: string | null;
  viewUrl: string | null;
  error?: string;
}

export function extractDriveFileId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  // Direct check if user provided only the ID
  if (/^[a-zA-Z0-9_-]{25,50}$/.test(trimmed)) {
    return trimmed;
  }

  try {
    const normalizedUrl = trimmed.startsWith('http://') || trimmed.startsWith('https://')
      ? trimmed
      : `https://${trimmed}`;

    const parsed = new URL(normalizedUrl);
    const hostname = parsed.hostname.toLowerCase();

    // Verify Google Drive host
    const isDriveHost = 
      hostname === 'drive.google.com' || 
      hostname === 'docs.google.com';

    if (!isDriveHost) {
      return null;
    }

    // Pattern 1: /file/d/{id}/...
    const fileDMatch = parsed.pathname.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileDMatch && fileDMatch[1]) {
      return fileDMatch[1];
    }

    // Pattern 2: ?id={id} (from /open, /uc, etc.)
    const idParam = parsed.searchParams.get('id');
    if (idParam && /^[a-zA-Z0-9_-]+$/.test(idParam)) {
      return idParam;
    }

    // Pattern 3: /folders/{id} is a folder, not a streamable file
    if (parsed.pathname.includes('/folders/')) {
      return null;
    }

    return null;
  } catch {
    // Regex fallback
    const match = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    return match && match[1] ? match[1] : null;
  }
}

export function parseGoogleDriveUrl(url: string): GoogleDriveParseResult {
  if (!url || !url.trim()) {
    return {
      isValid: false,
      fileId: null,
      embedUrl: null,
      viewUrl: null,
      error: 'URL video Google Drive wajib diisi'
    };
  }

  const fileId = extractDriveFileId(url);
  if (!fileId) {
    return {
      isValid: false,
      fileId: null,
      embedUrl: null,
      viewUrl: null,
      error: 'Format link Google Drive tidak valid. Gunakan format: https://drive.google.com/file/d/FILE_ID/view'
    };
  }

  return {
    isValid: true,
    fileId,
    // Google Drive official embedded preview route
    embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
    viewUrl: `https://drive.google.com/file/d/${fileId}/view?usp=sharing`
  };
}
