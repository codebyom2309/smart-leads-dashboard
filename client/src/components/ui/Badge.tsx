import React from 'react';
import { clsx } from 'clsx';
import { LeadStatus, LeadSource } from '../../types';
import { STATUS_CONFIG, SOURCE_CONFIG } from '../../constants';

interface StatusBadgeProps {
  status: LeadStatus;
  showDot?: boolean;
}

interface SourceBadgeProps {
  source: LeadSource;
}

interface RoleBadgeProps {
  role: 'admin' | 'sales';
}

export const StatusBadge = ({ status, showDot = true }: StatusBadgeProps): JSX.Element => {
  const config = STATUS_CONFIG[status];

  return (
    <span className={clsx('badge', config.className)}>
      {showDot && (
        <span className={clsx('w-1.5 h-1.5 rounded-full flex-shrink-0', config.dotColor)} />
      )}
      {config.label}
    </span>
  );
};

export const SourceBadge = ({ source }: SourceBadgeProps): JSX.Element => {
  const config = SOURCE_CONFIG[source];

  return (
    <span className={clsx('badge', config.className)}>
      {config.icon} {config.label}
    </span>
  );
};

export const RoleBadge = ({ role }: RoleBadgeProps): JSX.Element => (
  <span
    className={clsx('badge', {
      'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300': role === 'admin',
      'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300': role === 'sales',
    })}
  >
    {role === 'admin' ? '👑 Admin' : '👤 Sales'}
  </span>
);
