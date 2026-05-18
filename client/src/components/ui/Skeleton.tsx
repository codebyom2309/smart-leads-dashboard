import React from 'react';
import { clsx } from 'clsx';

interface SkeletonProps {
  className?: string;
  lines?: number;
  style?: React.CSSProperties;
}

export const Skeleton = ({ className, style }: { className?: string; style?: React.CSSProperties }): JSX.Element => (
  <div className={clsx('skeleton', className)} style={style} />
);

export const SkeletonText = ({ lines = 3 }: SkeletonProps): JSX.Element => (
  <div className="space-y-2">
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className={clsx('h-4 rounded', {
          'w-full': i < lines - 1,
          'w-3/4': i === lines - 1,
        })}
      />
    ))}
  </div>
);

export const StatCardSkeleton = (): JSX.Element => (
  <div className="card p-6 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="h-4 w-24 rounded" />
      <Skeleton className="h-10 w-10 rounded-lg" />
    </div>
    <Skeleton className="h-8 w-20 rounded mb-2" />
    <Skeleton className="h-3 w-32 rounded" />
  </div>
);

export const TableRowSkeleton = ({ cols = 6 }: { cols?: number }): JSX.Element => (
  <tr className="table-row">
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="table-cell">
        <Skeleton className="h-4 rounded" style={{ width: `${60 + (i * 7 % 40)}%` }} />
      </td>
    ))}
  </tr>
);

export const LeadCardSkeleton = (): JSX.Element => (
  <div className="card p-5 animate-pulse">
    <div className="flex items-start gap-3 mb-4">
      <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32 rounded" />
        <Skeleton className="h-3 w-48 rounded" />
      </div>
    </div>
    <div className="flex gap-2">
      <Skeleton className="h-5 w-16 rounded-full" />
      <Skeleton className="h-5 w-20 rounded-full" />
    </div>
  </div>
);
