import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import {
  MoreHorizontal,
  Edit2,
  Trash2,
  Eye,
  Mail,
  Phone,
  Building,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { Lead, LeadFilters } from '../../types';
import { StatusBadge, SourceBadge } from '../ui/Badge';
import { Pagination } from '../ui/Pagination';
import { EmptyState } from '../ui/EmptyState';
import { TableRowSkeleton } from '../ui/Skeleton';
import { PaginationMeta } from '../../types';
import { clsx } from 'clsx';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
}

const columns: Column[] = [
  { key: 'name', label: 'Lead', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'source', label: 'Source' },
  { key: 'company', label: 'Company', sortable: true },
  { key: 'createdAt', label: 'Created', sortable: true },
  { key: 'actions', label: '' },
];

interface LeadTableProps {
  leads: Lead[];
  pagination: PaginationMeta;
  isLoading: boolean;
  filters: LeadFilters;
  onPageChange: (page: number) => void;
  onSortChange: (field: string) => void;
  onView: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

interface ActionMenuProps {
  lead: Lead;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ActionMenu = ({ lead, onView, onEdit, onDelete }: ActionMenuProps): JSX.Element => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="p-1.5 rounded-lg text-mute hover:text-ink hover:bg-canvas-soft-2 transition-colors dark:hover:bg-dark-hover dark:hover:text-white"
      >
        <MoreHorizontal size={15} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 z-20 mt-1 w-40 bg-white dark:bg-dark-card rounded-xl shadow-modal border border-hairline dark:border-dark-border overflow-hidden"
            >
              <button
                onClick={() => { onView(); setOpen(false); }}
                className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-body hover:bg-canvas-soft dark:text-gray-300 dark:hover:bg-dark-hover transition-colors"
              >
                <Eye size={14} /> View Details
              </button>
              <button
                onClick={() => { onEdit(); setOpen(false); }}
                className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-body hover:bg-canvas-soft dark:text-gray-300 dark:hover:bg-dark-hover transition-colors"
              >
                <Edit2 size={14} /> Edit Lead
              </button>
              <div className="my-1 border-t border-hairline dark:border-dark-border" />
              <button
                onClick={() => { onDelete(); setOpen(false); }}
                className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-error hover:bg-error-soft dark:hover:bg-red-900/20 transition-colors"
              >
                <Trash2 size={14} /> Delete
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export const LeadTable = ({
  leads,
  pagination,
  isLoading,
  filters,
  onPageChange,
  onSortChange,
  onView,
  onEdit,
  onDelete,
}: LeadTableProps): JSX.Element => {
  const SortIcon = ({ field }: { field: string }): JSX.Element => {
    if (filters.sortBy !== field) {
      return <span className="w-3" />;
    }
    return filters.sortOrder === 'asc' ? (
      <ChevronUp size={12} className="text-primary" />
    ) : (
      <ChevronDown size={12} className="text-primary" />
    );
  };

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-canvas-soft dark:bg-dark-hover">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={clsx('table-header text-left', col.sortable && 'cursor-pointer select-none')}
                  onClick={() => col.sortable && onSortChange(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && <SortIcon field={col.key} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => <TableRowSkeleton key={i} cols={6} />)
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <EmptyState
                    title="No leads found"
                    description="Try adjusting your filters or create a new lead to get started."
                  />
                </td>
              </tr>
            ) : (
              <AnimatePresence mode="popLayout">
                {leads.map((lead, index) => (
                  <motion.tr
                    key={lead._id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ delay: index * 0.03, duration: 0.25 }}
                    className="table-row"
                  >
                    {/* Lead info */}
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary-100 to-accent/20 dark:from-primary-900/40 dark:to-accent/20 flex items-center justify-center text-primary dark:text-primary-300 text-xs font-semibold">
                          {lead.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-ink dark:text-white truncate max-w-[160px]">
                            {lead.name}
                          </p>
                          <p className="text-xs text-mute dark:text-gray-500 flex items-center gap-1 truncate max-w-[160px]">
                            <Mail size={10} /> {lead.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="table-cell">
                      <StatusBadge status={lead.status} />
                    </td>

                    {/* Source */}
                    <td className="table-cell">
                      <SourceBadge source={lead.source} />
                    </td>

                    {/* Company */}
                    <td className="table-cell">
                      {lead.company ? (
                        <span className="flex items-center gap-1.5 text-sm text-body dark:text-gray-400">
                          <Building size={12} className="text-mute" />
                          {lead.company}
                        </span>
                      ) : (
                        <span className="text-mute text-sm dark:text-gray-600">—</span>
                      )}
                    </td>

                    {/* Created At */}
                    <td className="table-cell">
                      <span className="text-sm text-body dark:text-gray-400 font-mono text-xs">
                        {format(new Date(lead.createdAt), 'MMM d, yyyy')}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="table-cell text-right">
                      <ActionMenu
                        lead={lead}
                        onView={() => onView(lead)}
                        onEdit={() => onEdit(lead)}
                        onDelete={() => onDelete(lead)}
                      />
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>

      {!isLoading && leads.length > 0 && (
        <Pagination pagination={pagination} onPageChange={onPageChange} />
      )}
    </div>
  );
};
