import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'featured' | 'category' | 'outline' | 'danger';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'category',
  className = ''
}) => {
  let styleClasses = 'bg-white/10 text-white/90 border border-white/10';

  if (variant === 'gold') {
    styleClasses = 'bg-[var(--color-gold-primary)]/20 text-[var(--color-gold-primary)] border border-[var(--color-gold-primary)]/40 font-semibold';
  } else if (variant === 'featured') {
    styleClasses = 'bg-gradient-to-r from-amber-500/30 to-yellow-500/30 text-amber-300 border border-amber-400/50 font-bold shadow-sm';
  } else if (variant === 'category') {
    styleClasses = 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)]';
  } else if (variant === 'outline') {
    styleClasses = 'border border-[var(--color-border-glass)] text-[var(--color-text-primary)]';
  } else if (variant === 'danger') {
    styleClasses = 'bg-red-500/20 text-red-400 border border-red-500/30 font-medium';
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs tracking-wider uppercase backdrop-blur-sm ${styleClasses} ${className}`}
    >
      {children}
    </span>
  );
};
