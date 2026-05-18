import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { clsx } from 'clsx';
import { PaginationMeta } from '../../types';

interface PaginationProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ pagination, onPageChange }: PaginationProps): JSX.Element => {
  const { page, totalPages, total, limit } = pagination;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const getPageNumbers = (): number[] => {
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: number[] = [];

    for (
      let i = Math.max(2, page - delta);
      i <= Math.min(totalPages - 1, page + delta);
      i++
    ) {
      range.push(i);
    }

    if (page - delta > 2) {
      rangeWithDots.push(1, -1);
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (page + delta < totalPages - 1) {
      rangeWithDots.push(-2, totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) {
    return (
      <div className="flex items-center justify-between px-4 py-3">
        <p className="text-xs text-mute dark:text-gray-500">
          Showing {total} result{total !== 1 ? 's' : ''}
        </p>
      </div>
    );
  }

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-hairline dark:border-dark-border">
      <p className="text-xs text-mute dark:text-gray-500 order-2 sm:order-1">
        Showing <span className="font-medium text-ink dark:text-gray-300">{start}–{end}</span> of{' '}
        <span className="font-medium text-ink dark:text-gray-300">{total}</span> results
      </p>

      <div className="flex items-center gap-1 order-1 sm:order-2">
        <button
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          className="p-1.5 rounded-lg text-mute hover:text-ink hover:bg-canvas-soft-2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors dark:hover:bg-dark-hover dark:hover:text-white"
        >
          <ChevronsLeft size={15} />
        </button>
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="p-1.5 rounded-lg text-mute hover:text-ink hover:bg-canvas-soft-2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors dark:hover:bg-dark-hover dark:hover:text-white"
        >
          <ChevronLeft size={15} />
        </button>

        {pageNumbers.map((num, i) =>
          num < 0 ? (
            <span key={`dots-${i}`} className="px-1 text-mute text-sm">
              …
            </span>
          ) : (
            <button
              key={num}
              onClick={() => onPageChange(num)}
              className={clsx(
                'w-8 h-8 text-xs rounded-lg font-medium transition-all duration-200',
                num === page
                  ? 'bg-primary text-white shadow-glow-sm'
                  : 'text-body hover:text-ink hover:bg-canvas-soft-2 dark:text-gray-400 dark:hover:bg-dark-hover dark:hover:text-white'
              )}
            >
              {num}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="p-1.5 rounded-lg text-mute hover:text-ink hover:bg-canvas-soft-2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors dark:hover:bg-dark-hover dark:hover:text-white"
        >
          <ChevronRight size={15} />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages}
          className="p-1.5 rounded-lg text-mute hover:text-ink hover:bg-canvas-soft-2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors dark:hover:bg-dark-hover dark:hover:text-white"
        >
          <ChevronsRight size={15} />
        </button>
      </div>
    </div>
  );
};
