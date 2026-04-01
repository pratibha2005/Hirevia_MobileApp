"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'success' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm';
  asChild?: boolean;
  loading?: boolean;
}

const variantClasses: Record<string, string> = {
  primary:
    'bg-primary-gradient text-white border border-primary/30 shadow-glow-sm ' +
    'hover:shadow-glow-md hover:brightness-110 active:scale-[0.97] active:shadow-none ' +
    'disabled:opacity-50 disabled:cursor-not-allowed',
  secondary:
    'bg-surface-lowest text-on-surface border border-glass-border ' +
    'hover:bg-surface-high hover:border-primary/30 active:scale-[0.97] ' +
    'backdrop-blur-sm',
  tertiary:
    'bg-transparent text-primary-gradient-start hover:text-primary-gradient-end ' +
    'hover:bg-primary-light active:scale-[0.97]',
  danger:
    'bg-danger/90 text-white border border-danger/30 shadow-[0_4px_16px_rgba(239,68,68,0.3)] ' +
    'hover:bg-danger hover:shadow-[0_4px_24px_rgba(239,68,68,0.45)] active:scale-[0.97]',
  success:
    'bg-success/90 text-white border border-success/30 shadow-[0_4px_16px_rgba(34,197,94,0.3)] ' +
    'hover:bg-success active:scale-[0.97]',
  ghost:
    'bg-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-low ' +
    'active:scale-[0.97]',
};

const sizeClasses: Record<string, string> = {
  default: 'h-9 px-4 py-2 text-sm rounded-md',
  sm:      'h-7 px-3 text-xs rounded-md',
  lg:      'h-11 px-6 text-sm rounded-md',
  icon:    'h-9 w-9 rounded-md',
  'icon-sm': 'h-7 w-7 rounded-sm',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', loading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap font-medium',
          'transition-all duration-200 ease-in-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-1 focus-visible:ring-offset-surface-base',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            {children}
          </span>
        ) : children}
      </button>
    );
  }
);
Button.displayName = 'Button';
