import React from 'react';
import { motion } from 'framer-motion';
import {
  Users2,
  TrendingUp,
  Activity,
  UserPlus,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { StatCard } from '../../components/ui/StatCard';
import { StatusChart, SourceChart } from '../../components/dashboard/Charts';
import { StatCardSkeleton } from '../../components/ui/Skeleton';
import { useLeadStats } from '../../hooks/useLeads';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../../components/ui/Badge';
import { useLeads } from '../../hooks/useLeads';
import { format } from 'date-fns';

export const DashboardPage = (): JSX.Element => {
  const { data: statsData, isLoading: statsLoading } = useLeadStats();
  const { data: recentData } = useLeads({ limit: 5, sortOrder: 'desc' });
  const { user } = useAuth();

  const stats = statsData;
  const recentLeads = recentData?.leads ?? [];

  return (
    <DashboardLayout pageTitle="Dashboard">
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 dark:bg-primary-900/20 rounded-full text-xs font-medium text-primary dark:text-primary-300 mb-3 font-mono">
            <span className="w-1.5 h-1.5 bg-primary dark:bg-primary-400 rounded-full animate-pulse" />
            {user?.role === 'admin' ? 'Admin Dashboard' : 'Sales Dashboard'}
          </div>
          <h1 className="section-title text-3xl">
            Good {getGreeting()},{' '}
            <span className="gradient-text">{user?.name?.split(' ')[0]}</span>.
          </h1>
          <p className="section-subtitle mt-2">
            Here's what's happening with your leads today.
          </p>
        </motion.div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : stats ? (
          <>
            <StatCard
              title="Total Leads"
              value={stats.total}
              subtitle="All time"
              icon={<Users2 size={18} className="text-primary dark:text-primary-300" />}
              iconBg="bg-primary-50 dark:bg-primary-900/20"
              delay={0}
            />
            <StatCard
              title="New Leads"
              value={stats.byStatus.New}
              subtitle="Ready to contact"
              icon={<UserPlus size={18} className="text-blue-500 dark:text-blue-400" />}
              iconBg="bg-blue-50 dark:bg-blue-900/20"
              delay={0.05}
            />
            <StatCard
              title="Qualified"
              value={stats.byStatus.Qualified}
              subtitle="High potential"
              icon={<TrendingUp size={18} className="text-emerald-500 dark:text-emerald-400" />}
              iconBg="bg-emerald-50 dark:bg-emerald-900/20"
              trend={stats.byStatus.Qualified > 0 ? 12 : 0}
              trendLabel="vs last month"
              delay={0.1}
            />
            <StatCard
              title="30-Day Activity"
              value={stats.recentActivity}
              subtitle="Leads created"
              icon={<Activity size={18} className="text-violet-500 dark:text-violet-400" />}
              iconBg="bg-violet-50 dark:bg-violet-900/20"
              delay={0.15}
            />
          </>
        ) : null}
      </div>

      {/* Charts */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <StatusChart stats={stats} />
          <SourceChart stats={stats} />
        </div>
      )}

      {/* Recent leads */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="card overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-hairline dark:border-dark-border">
          <div>
            <h2 className="text-sm font-semibold text-ink dark:text-white tracking-tight">
              Recent Leads
            </h2>
            <p className="text-xs text-mute dark:text-gray-500 mt-0.5">Latest activity</p>
          </div>
          <Link
            to="/leads"
            className="flex items-center gap-1.5 text-xs font-medium text-primary dark:text-primary-300 hover:underline"
          >
            View all <ArrowRight size={13} />
          </Link>
        </div>

        {recentLeads.length === 0 ? (
          <div className="p-8 text-center text-sm text-mute dark:text-gray-500">
            No leads yet.{' '}
            <Link to="/leads" className="text-primary hover:underline dark:text-primary-300">
              Create your first lead
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-hairline dark:divide-dark-border">
            {recentLeads.map((lead) => (
              <div
                key={lead._id}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-canvas-soft dark:hover:bg-dark-hover transition-colors"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary-100 to-accent/20 dark:from-primary-900/40 dark:to-accent/20 flex items-center justify-center text-primary dark:text-primary-300 text-xs font-semibold">
                  {lead.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink dark:text-white truncate">{lead.name}</p>
                  <p className="text-xs text-mute dark:text-gray-500 truncate">{lead.email}</p>
                </div>
                <StatusBadge status={lead.status} showDot={false} />
                <span className="text-xs text-mute dark:text-gray-500 hidden sm:block font-mono">
                  {format(new Date(lead.createdAt), 'MMM d')}
                </span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
};
