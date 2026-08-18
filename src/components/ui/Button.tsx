import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  id?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  id,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C71925] dark:focus-visible:ring-[#E32935] focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none rounded-full';

  const sizeClasses = {
    sm: 'text-xs px-4 py-2 gap-1.5 min-h-[36px]',
    md: 'text-sm px-6 py-3 gap-2 min-h-[44px]',
    lg: 'text-base px-8 py-4 gap-2.5 min-h-[52px]',
  };

  const variantClasses = {
    primary: 'bg-[#C71925] hover:bg-[#A80F19] dark:bg-[#E32935] dark:hover:bg-[#FF4652] text-white shadow-sm hover:shadow-md active:bg-[#900C15]',
    secondary: 'bg-[#EFF7FB] hover:bg-[#E5F3FA] dark:bg-[#102C3C] dark:hover:bg-[#163B50] text-[#1684C4] dark:text-[#2498D1] border border-[#1684C4]/15 dark:border-[#2498D1]/25 active:bg-[#D5ECF8]',
    accent: 'bg-[#73B832] hover:bg-[#62A028] dark:bg-[#82C744] dark:hover:bg-[#92D754] text-white shadow-sm',
    outline: 'border border-[#C71925] dark:border-[#E32935] text-[#C71925] dark:text-[#E32935] hover:bg-[#C71925]/10 dark:hover:bg-[#E32935]/15 active:bg-[#C71925]/20',
    ghost: 'text-[#17202A] dark:text-[#F5F7F9] hover:bg-black/5 dark:hover:bg-white/10 active:bg-black/10 dark:active:bg-white/15',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm',
  };

  return (
    <button
      id={id}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span className="truncate">{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
