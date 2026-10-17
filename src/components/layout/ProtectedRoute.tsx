import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Film } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg-primary)] px-4">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-2 border-[var(--color-border-glass)] border-t-[var(--color-gold-primary)] rounded-full animate-spin" />
          <Film className="w-6 h-6 text-[var(--color-gold-primary)] absolute" />
        </div>
        <p className="mt-4 text-sm font-medium tracking-widest uppercase text-[var(--color-text-secondary)]">
          Memulihkan Sesi Sinema...
        </p>
      </div>
    );
  }

  if (!user) {
    // Preserve attempted URL to redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
