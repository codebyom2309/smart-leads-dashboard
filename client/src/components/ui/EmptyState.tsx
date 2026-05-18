import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { InboxIcon } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export const EmptyState = ({
  title,
  description,
  action,
  icon,
}: EmptyStateProps): JSX.Element => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-16 px-8 text-center"
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-primary-100 dark:bg-primary-900/20 rounded-full blur-xl opacity-60 scale-150" />
        <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-canvas-soft-2 dark:bg-dark-hover border border-hairline dark:border-dark-border">
          {icon ?? <InboxIcon size={28} className="text-mute dark:text-gray-500" />}
        </div>
      </div>

      <h3 className="text-base font-semibold text-ink dark:text-white mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-mute dark:text-gray-500 max-w-xs mb-6 text-balance">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </motion.div>
  );
};
