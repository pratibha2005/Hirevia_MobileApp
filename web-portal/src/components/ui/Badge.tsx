import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 
    | 'default' 
    | 'outline' 
    | 'primary'
    | 'secondary'
    | 'success' 
    | 'danger' 
    | 'warning'
    | 'applied'
    | 'shortlisted'
    | 'interview'
    | 'offer'
    | 'rejected'
    | 'talent'
    | 'confirmed'
    | 'pending';
}

export const statusVariantMap: Record<string, BadgeProps['variant']> = {
  Applied:    'applied',
  Shortlisted:'shortlisted',
  Interview:  'interview',
  Offer:      'offer',
  Rejected:   'rejected',
  Confirmed:  'confirmed',
  Pending:    'pending',
};

const variantClasses: Record<string, string> = {
  default:    'bg-surface-high text-on-surface-variant border border-glass-border',
  outline:    'bg-transparent border border-glass-border text-on-surface-variant',
  primary:    'bg-primary/15 text-primary-gradient-start border border-primary/25',
  secondary:  'bg-secondary/15 text-secondary border border-secondary/25',
  success:    'bg-success/12 text-success border border-success/25',
  danger:     'bg-danger/12 text-danger border border-danger/25',
  warning:    'bg-warning/12 text-warning border border-warning/25',
  applied:    'bg-surface-high text-on-surface-variant border border-glass-border',
  shortlisted:'bg-[rgba(99,102,241,0.15)] text-[#818CF8] border border-[rgba(99,102,241,0.3)]',
  interview:  'bg-[rgba(245,158,11,0.12)] text-[#FCD34D] border border-[rgba(245,158,11,0.25)]',
  offer:      'bg-[rgba(34,197,94,0.12)] text-[#4ADE80] border border-[rgba(34,197,94,0.25)]',
  rejected:   'bg-[rgba(239,68,68,0.12)] text-[#F87171] border border-[rgba(239,68,68,0.25)]',
  talent:     'bg-[rgba(34,197,94,0.12)] text-[#4ADE80] border border-[rgba(34,197,94,0.25)]',
  confirmed:  'bg-[rgba(34,197,94,0.12)] text-[#4ADE80] border border-[rgba(34,197,94,0.25)]',
  pending:    'bg-[rgba(245,158,11,0.12)] text-[#FCD34D] border border-[rgba(245,158,11,0.25)]',
};

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide',
        'transition-colors duration-150 whitespace-nowrap',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
