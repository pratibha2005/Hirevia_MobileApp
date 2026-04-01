import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Simplified logic to just show up to 5 surrounding pages or ellipsis
  const getVisiblePages = () => {
    if (totalPages <= 7) return pages;

    if (currentPage <= 4) {
      return [...pages.slice(0, 5), '...', totalPages];
    } else if (currentPage >= totalPages - 3) {
      return [1, '...', ...pages.slice(totalPages - 5)];
    } else {
      return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
    }
  };

  return (
    <nav className="flex items-center justify-between px-4 py-3 bg-surface border-t border-glass-border sm:px-6" aria-label="Pagination">
      <div className="hidden sm:block">
        <p className="text-sm text-on-surface-subtle">
          Showing page <span className="font-medium text-on-surface">{currentPage}</span> of{' '}
          <span className="font-medium text-on-surface">{totalPages}</span>
        </p>
      </div>
      <div className="flex flex-1 justify-between sm:justify-end gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="relative inline-flex items-center rounded-md bg-surface-lowest px-3 py-2 text-sm font-semibold text-on-surface ring-1 ring-inset ring-glass-border hover:bg-surface-high disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="h-4 w-4 mr-1" aria-hidden="true" />
          Previous
        </button>

        <div className="hidden sm:flex items-center space-x-1">
          {getVisiblePages().map((page, index) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${index}`} className="px-3 py-2 text-on-surface-subtle">
                  <MoreHorizontal className="h-4 w-4" />
                </span>
              );
            }
            return (
              <button
                key={page}
                onClick={() => onPageChange(page as number)}
                className={`relative inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold transition-all ${
                  currentPage === page
                    ? 'bg-primary text-white shadow-glow-sm'
                    : 'text-on-surface-subtle hover:bg-surface-high hover:text-on-surface'
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="relative inline-flex items-center rounded-md bg-surface-lowest px-3 py-2 text-sm font-semibold text-on-surface ring-1 ring-inset ring-glass-border hover:bg-surface-high disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
