import React from 'react';
import { Badge } from './Badge';

interface SectionHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  id?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badge,
  title,
  subtitle,
  align = 'center',
  className = '',
  id,
}) => {
  const alignClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center mx-auto',
    right: 'text-right items-end ml-auto',
  };

  return (
    <div id={id} className={`flex flex-col max-w-3xl ${alignClasses[align]} mb-10 sm:mb-14 ${className}`}>
      {badge && (
        <Badge variant="secondary" size="sm" className="mb-3 tracking-wider text-[11px] font-semibold">
          {badge}
        </Badge>
      )}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#1C1C19] font-serif leading-[1.25]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-base sm:text-lg text-[#556056] leading-relaxed max-w-2xl font-sans">
          {subtitle}
        </p>
      )}
    </div>
  );
};
