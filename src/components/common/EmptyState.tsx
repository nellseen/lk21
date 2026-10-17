import React from 'react';
import { Film, Plus, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionLink?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Katalog Masih Kosong',
  description = 'Belum ada film yang ditambahkan ke katalog streaming.',
  actionText,
  actionLink,
  onAction,
  icon
}) => {
  const { isAdmin } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl glass-panel border border-[var(--color-border-subtle)] max-w-md mx-auto my-8">
      <div className="w-16 h-16 rounded-2xl bg-[var(--color-gold-glow)] flex items-center justify-center text-[var(--color-gold-primary)] mb-5 shadow-lg">
        {icon || <Film className="w-8 h-8" />}
      </div>
      <h3 className="text-xl font-bold font-cinzel text-[var(--color-text-primary)] mb-2">
        {title}
      </h3>
      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-6">
        {description}
      </p>

      {actionLink && (
        <Link
          to={actionLink}
          className="gold-button inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold"
        >
          {actionText || 'Jelajahi'}
        </Link>
      )}

      {onAction && !actionLink && (
        <button
          onClick={onAction}
          className="gold-button inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          {actionText || 'Muat Ulang'}
        </button>
      )}

      {!actionLink && !onAction && isAdmin && (
        <Link
          to="/admin/upload"
          className="gold-button inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold"
        >
          <Plus className="w-4 h-4" />
          Tambah Film Perdana
        </Link>
      )}
    </div>
  );
};
