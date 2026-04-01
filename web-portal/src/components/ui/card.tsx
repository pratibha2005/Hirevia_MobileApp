import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'elevated' | 'flat';
}

export function Card({ className, variant = 'default', children, ...props }: CardProps) {
  const variants: Record<string, string> = {
    default:
      'bg-surface-lowest border border-glass-border rounded-xl shadow-card ' +
      'transition-all duration-200 ease-in-out',
    glass:
      'glass-card shadow-glass transition-all duration-200 ease-in-out',
    elevated:
      'bg-surface-lowest border border-glass-border rounded-xl shadow-glass ' +
      'hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200',
    flat:
      'bg-surface-low border border-glass-border/50 rounded-xl',
  };

  return (
    <div
      className={cn(variants[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col space-y-1 p-6 pb-0', className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('text-lg font-display font-semibold text-on-surface leading-tight tracking-tight', className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6 pt-4', className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-center p-6 pt-0 border-t border-glass-border mt-4', className)}
      {...props}
    />
  );
}
