import React from 'react';

export const MovieCardSkeleton: React.FC = () => {
  return (
    <div className="relative rounded-xl overflow-hidden glass-card aspect-[2/3] animate-pulse">
      <div className="w-full h-full bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 p-4 space-y-2">
        <div className="h-4 bg-white/20 rounded-md w-3/4" />
        <div className="h-3 bg-white/10 rounded-md w-1/2" />
      </div>
    </div>
  );
};

export const HeroSkeleton: React.FC = () => {
  return (
    <div className="w-full h-[65vh] min-h-[460px] max-h-[750px] relative rounded-2xl overflow-hidden glass-card animate-pulse">
      <div className="absolute inset-0 bg-white/5" />
      <div className="absolute bottom-12 left-8 md:left-16 space-y-4 max-w-xl">
        <div className="h-6 bg-white/20 rounded-full w-28" />
        <div className="h-10 bg-white/25 rounded-lg w-4/5" />
        <div className="h-4 bg-white/10 rounded-md w-full" />
        <div className="h-4 bg-white/10 rounded-md w-2/3" />
        <div className="flex gap-4 pt-4">
          <div className="h-12 w-36 bg-[var(--color-gold-primary)]/40 rounded-xl" />
          <div className="h-12 w-36 bg-white/10 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export const MovieGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  );
};
