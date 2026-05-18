import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { clsx } from 'clsx';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: number;
  trendLabel?: string;
  iconBg?: string;
  delay?: number;
}

export const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendLabel,
  iconBg = 'bg-primary-50 dark:bg-primary-900/20',
  delay = 0,
}: StatCardProps): JSX.Element => {
  const trendPositive = trend !== undefined && trend > 0;
  const trendNegative = trend !== undefined && trend < 0;
  const trendNeutral = trend === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      className="card-hover p-6 group cursor-default"
    >
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-medium text-mute dark:text-gray-500">{title}</p>
        <div
          className={clsx(
            'p-2.5 rounded-xl transition-all duration-300 group-hover:scale-110',
            iconBg
          )}
        >
          {icon}
        </div>
      </div>

      <p className="text-3xl font-semibold text-ink tracking-tight dark:text-white mb-1">
        {typeof value === 'number'
          ? value.toLocaleString()
          : value}
      </p>

      {(subtitle ?? trend !== undefined) && (
        <div className="flex items-center gap-2 mt-2">
          {trend !== undefined && (
            <span
              className={clsx(
                'inline-flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded-full',
                {
                  'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20': trendPositive,
                  'text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-900/20': trendNegative,
                  'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-800': trendNeutral,
                }
              )}
            >
              {trendPositive ? <TrendingUp size={10} /> : trendNegative ? <TrendingDown size={10} /> : <Minus size={10} />}
              {Math.abs(trend ?? 0)}%
            </span>
          )}
          {(trendLabel ?? subtitle) && (
            <span className="text-xs text-mute dark:text-gray-500">
              {trendLabel ?? subtitle}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
};
