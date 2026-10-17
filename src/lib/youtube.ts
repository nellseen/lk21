/**
 * YouTube URL Parser & Validator Utility
 * Supports:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - With query params like &t=..., &feature=...
 */

export interface YouTubeParseResult {
  isValid: boolean;
  videoId: string | null;
  embedUrl: string | null;
  error?: string;
}

export function extractYouTubeId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  try {
    // Add protocol if missing for URL parsing
    const normalizedUrl = trimmed.startsWith('http://') || trimmed.startsWith('https://') 
      ? trimmed 
      : `https://${trimmed}`;

    const parsed = new URL(normalizedUrl);
    const hostname = parsed.hostname.toLowerCase();

    // Check valid YouTube domains
    const isYouTubeDomain = 
      hostname === 'youtube.com' ||
      hostname === 'www.youtube.com' ||
      hostname === 'm.youtube.com' ||
      hostname === 'music.youtube.com' ||
      hostname === 'youtu.be';

    if (!isYouTubeDomain) {
      return null;
    }

    // 1. Short links: youtu.be/ID
    if (hostname === 'youtu.be') {
      const id = parsed.pathname.replace(/^\/+/, '').split('/')[0];
      return isValidVideoId(id) ? id : null;
    }

    // 2. Shorts: youtube.com/shorts/ID
    if (parsed.pathname.includes('/shorts/')) {
      const parts = parsed.pathname.split('/shorts/');
      if (parts[1]) {
        const id = parts[1].split('/')[0].split('?')[0];
        return isValidVideoId(id) ? id : null;
      }
    }

    // 3. Embed: youtube.com/embed/ID
    if (parsed.pathname.includes('/embed/')) {
      const parts = parsed.pathname.split('/embed/');
      if (parts[1]) {
        const id = parts[1].split('/')[0].split('?')[0];
        return isValidVideoId(id) ? id : null;
      }
    }

    // 4. Standard watch: youtube.com/watch?v=ID
    const v = parsed.searchParams.get('v');
    if (v && isValidVideoId(v)) {
      return v;
    }

    return null;
  } catch {
    // Fallback regex if URL parsing fails
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = trimmed.match(regex);
    return match && match[1] && isValidVideoId(match[1]) ? match[1] : null;
  }
}

function isValidVideoId(id: string): boolean {
  // YouTube video IDs are 11 characters alphanumeric plus '-' and '_'
  return /^[a-zA-Z0-9_-]{11}$/.test(id);
}

export function parseYouTubeUrl(url: string): YouTubeParseResult {
  if (!url || !url.trim()) {
    return {
      isValid: false,
      videoId: null,
      embedUrl: null,
      error: 'URL trailer kosong'
    };
  }

  const videoId = extractYouTubeId(url);
  if (!videoId) {
    return {
      isValid: false,
      videoId: null,
      embedUrl: null,
      error: 'Format URL YouTube tidak valid. Gunakan format youtube.com/watch?v=ID atau youtu.be/ID'
    };
  }

  return {
    isValid: true,
    videoId,
    embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`
  };
}
