import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'close' | 'selector' | 'model-selector';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
  loading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  loading = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background';
  
  const variantClasses = {
    primary: 'bg-freshgreens-primary-700 text-white hover:bg-freshgreens-primary-600 shadow-sm hover:shadow-md',
    secondary: 'bg-freshgreens-secondary-100 text-freshgreens-secondary-900 hover:bg-freshgreens-secondary-200 border border-freshgreens-secondary-200',
    outline: 'border border-freshgreens-secondary-200 bg-white hover:bg-freshgreens-secondary-50 hover:text-freshgreens-secondary-900 dark:bg-freshgreens-secondary-900 dark:border-freshgreens-secondary-700 dark:hover:bg-freshgreens-secondary-800',
    ghost: 'hover:bg-freshgreens-primary-50 hover:text-freshgreens-primary-900 dark:hover:bg-freshgreens-primary-950 dark:hover:text-freshgreens-primary-100',
    destructive: 'bg-freshgreens-contrast-700 text-white hover:bg-freshgreens-contrast-600',
    close: 'bg-transparent text-neutralharmony-primary-600 hover:text-red-700 hover:bg-red-400 border-none shadow-none',
    selector: 'bg-white text-neutralharmony-primary-600 hover:text-neutralharmony-primary-900 hover:bg-neutralharmony-background-50 border-2 border-neutralharmony-background-300 font-semibold shadow-sm',
    'model-selector': 'bg-white text-neutralharmony-primary-600 hover:text-neutralharmony-primary-900 hover:bg-neutralharmony-background-50 border-2 border-neutralharmony-background-300 font-semibold shadow-sm',
  };

  const sizeClasses = {
    sm: 'h-9 px-3 rounded-md',
    md: 'h-10 px-4 py-2',
    lg: 'h-11 px-8 rounded-md',
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!loading && icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
}
