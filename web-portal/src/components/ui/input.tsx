import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex w-full rounded-md border bg-surface-lowest px-3 py-2 text-sm',
          'text-on-surface placeholder:text-on-surface-variant/50',
          'border-glass-border',
          'transition-all duration-200 ease-in-out',
          'focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60',
          'hover:border-glass-border/80',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          error && 'border-danger/60 focus:ring-danger/30',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
