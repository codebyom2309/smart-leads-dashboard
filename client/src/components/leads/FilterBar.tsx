import React from 'react';
import { Search, Filter, X, Download, ArrowUpDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LeadFilters, LeadStatus, LeadSource, SortOrder } from '../../types';
import { LEAD_STATUSES, LEAD_SOURCES, STATUS_CONFIG, SOURCE_CONFIG } from '../../constants';
import { clsx } from 'clsx';

interface FilterBarProps {
  filters: LeadFilters;
  onFilterChange: <K extends keyof LeadFilters>(key: K, value: LeadFilters[K]) => void;
  onReset: () => void;
  onExport: () => void;
  isExporting: boolean;
  totalCount?: number;
}

const hasActiveFilters = (filters: LeadFilters): boolean =>
  !!(filters.search ?? filters.status ?? filters.source ?? filters.startDate ?? filters.endDate);

export const FilterBar = ({
  filters,
  onFilterChange,
  onReset,
  onExport,
  isExporting,
  totalCount,
}: FilterBarProps): JSX.Element => {
  const active = hasActiveFilters(filters);

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mute pointer-events-none" />
          <input
            type="search"
            placeholder="Search by name, email, or company..."
            value={filters.search ?? ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="form-input pl-9 pr-4 h-9 text-sm w-full"
          />
        </div>

        {/* Status filter */}
        <select
          value={filters.status ?? ''}
          onChange={(e) => onFilterChange('status', e.target.value as LeadStatus | '')}
          className="form-select h-9 text-sm w-full sm:w-auto sm:min-w-[140px]"
        >
          <option value="">All Statuses</option>
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {/* Source filter */}
        <select
          value={filters.source ?? ''}
          onChange={(e) => onFilterChange('source', e.target.value as LeadSource | '')}
          className="form-select h-9 text-sm w-full sm:w-auto sm:min-w-[140px]"
        >
          <option value="">All Sources</option>
          {LEAD_SOURCES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={filters.sortOrder ?? 'desc'}
          onChange={(e) => onFilterChange('sortOrder', e.target.value as SortOrder)}
          className="form-select h-9 text-sm w-full sm:w-auto sm:min-w-[130px]"
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>

        {/* Export */}
        <button
          onClick={onExport}
          disabled={isExporting}
          className="btn-secondary h-9 text-sm px-4 whitespace-nowrap flex-shrink-0"
        >
          <Download size={14} />
          {isExporting ? 'Exporting...' : 'Export CSV'}
        </button>
      </div>

      {/* Active filters row */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap items-center gap-2 overflow-hidden"
          >
            <span className="text-xs text-mute dark:text-gray-500 flex items-center gap-1">
              <Filter size={11} />
              Active filters:
            </span>

            {filters.search && (
              <FilterChip
                label={`"${filters.search}"`}
                onRemove={() => onFilterChange('search', '')}
              />
            )}
            {filters.status && (
              <FilterChip
                label={`Status: ${filters.status}`}
                onRemove={() => onFilterChange('status', '')}
              />
            )}
            {filters.source && (
              <FilterChip
                label={`Source: ${filters.source}`}
                onRemove={() => onFilterChange('source', '')}
              />
            )}

            <button
              onClick={onReset}
              className="text-xs text-error hover:underline ml-1"
            >
              Clear all
            </button>

            {totalCount !== undefined && (
              <span className="text-xs text-mute dark:text-gray-500 ml-auto">
                {totalCount} result{totalCount !== 1 ? 's' : ''}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FilterChip = ({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}): JSX.Element => (
  <motion.span
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
  >
    {label}
    <button onClick={onRemove} className="hover:text-primary-900 dark:hover:text-primary-100">
      <X size={11} />
    </button>
  </motion.span>
);
