'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  count?: number;
  variant?: 'text' | 'avatar' | 'card' | 'input';
  height?: string;
  width?: string;
}

const getVariantClasses = (variant: string, height?: string, width?: string) => {
  const baseClasses =
    'bg-gradient-to-r from-surface-mid via-surface-high to-surface-mid bg-[length:200%_100%] animate-shimmer rounded';

  switch (variant) {
    case 'avatar':
      return `${baseClasses} rounded-full w-12 h-12`;
    case 'card':
      return `${baseClasses} rounded-lg w-full h-32`;
    case 'input':
      return `${baseClasses} rounded-md w-full h-9`;
    case 'text':
    default:
      return `${baseClasses} ${height || 'h-4'} ${width || 'w-full'} rounded-sm`;
  }
};

export function Skeleton({
  count = 1,
  variant = 'text',
  className,
  height,
  width,
  ...props
}: SkeletonProps) {
  const skeletons = Array.from({ length: count });

  if (count > 1) {
    return (
      <div className="space-y-2">
        {skeletons.map((_, i) => (
          <div
            key={i}
            className={cn(getVariantClasses(variant, height, width), className)}
            {...props}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(getVariantClasses(variant, height, width), className)}
      {...props}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Skeleton variant="avatar" />
        <div className="flex-1 space-y-2">
          <Skeleton height="h-5" width="w-32" />
          <Skeleton height="h-3" width="w-48" />
        </div>
      </div>
      <Skeleton height="h-24" />
      <div className="flex gap-2">
        <Skeleton height="h-8" width="w-20" />
        <Skeleton height="h-8" width="w-28" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex gap-3 pb-3 border-b border-surface-high">
        <Skeleton height="h-4" width="w-12" />
        <Skeleton height="h-4" width="w-32" />
        <Skeleton height="h-4" width="w-24" />
        <Skeleton height="h-4" width="w-20" />
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-3 py-2">
          <Skeleton height="h-4" width="w-12" />
          <Skeleton height="h-4" width="w-32" />
          <Skeleton height="h-4" width="w-24" />
          <Skeleton height="h-4" width="w-20" />
        </div>
      ))}
    </div>
  );
}
