import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'success' | 'warning';
  size?: 'sm' | 'md';
  className?: string;
  id?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  id,
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium tracking-wide uppercase whitespace-nowrap rounded-full transition-colors';

  const sizeClasses = {
    sm: 'text-[10px] px-2.5 py-0.5 leading-4',
    md: 'text-xs px-3 py-1 leading-4',
  };

  const variantClasses = {
    primary: 'bg-[#C71925] dark:bg-[#E32935] text-white shadow-xs',
    secondary: 'bg-[#EFF7FB] dark:bg-[#102C3C] text-[#1684C4] dark:text-[#2498D1] border border-[#1684C4]/20 dark:border-[#2498D1]/30',
    accent: 'bg-[#73B832] dark:bg-[#82C744] text-white shadow-xs',
    outline: 'border border-[#C71925]/40 dark:border-[#E32935]/40 text-[#C71925] dark:text-[#E32935] bg-white/80 dark:bg-black/40 backdrop-blur-xs',
    success: 'bg-emerald-50 dark:bg-emerald-950/60 text-[#73B832] dark:text-[#82C744] border border-[#73B832]/30 dark:border-[#82C744]/30',
    warning: 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800',
  };

  return (
    <span
      id={id}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
