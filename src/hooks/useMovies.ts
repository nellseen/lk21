import { useEffect, useState, useMemo } from 'react';
import { Movie } from '../types';
import { subscribeToMovies } from '../services/movieService';

export function useMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToMovies(
      (data) => {
        setMovies(data);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const featuredMovies = useMemo(() => {
    return movies.filter((m) => m.featured);
  }, [movies]);

  const latestMovies = useMemo(() => {
    // Already sorted by createdAt desc in movieService
    return movies.slice(0, 10);
  }, [movies]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    movies.forEach((m) => {
      if (m.category) set.add(m.category);
    });
    return Array.from(set);
  }, [movies]);

  const getMoviesByCategory = (category: string) => {
    return movies.filter((m) => m.category?.toLowerCase() === category.toLowerCase());
  };

  return {
    movies,
    featuredMovies,
    latestMovies,
    categories,
    loading,
    error,
    getMoviesByCategory
  };
}
