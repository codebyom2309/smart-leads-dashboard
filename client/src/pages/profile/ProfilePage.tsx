import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { UserCircle, Mail, Shield, Calendar } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { RoleBadge } from '../../components/ui/Badge';

export const ProfilePage = (): JSX.Element => {
  const { user } = useAuth();

  if (!user) return <></>;

  return (
    <DashboardLayout pageTitle="Profile">
      <div className="max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-1.5 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <UserCircle size={16} className="text-primary dark:text-primary-300" />
            </div>
            <h1 className="section-title">Profile</h1>
          </div>
          <p className="section-subtitle">Your account information.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="card overflow-hidden"
        >
          {/* Profile header */}
          <div className="relative bg-gradient-to-r from-primary/10 via-accent/10 to-transparent dark:from-primary/20 dark:via-accent/20 px-6 py-8 border-b border-hairline dark:border-dark-border">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-semibold shadow-glow">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white dark:border-dark-card" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-ink dark:text-white tracking-tight">
                  {user.name}
                </h2>
                <p className="text-sm text-mute dark:text-gray-500">{user.email}</p>
                <div className="mt-2">
                  <RoleBadge role={user.role} />
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 space-y-4">
            <h3 className="text-xs font-medium text-mute dark:text-gray-500 uppercase tracking-wider font-mono">
              Account Details
            </h3>

            <div className="space-y-3">
              <ProfileDetail
                icon={<Mail size={14} />}
                label="Email Address"
                value={user.email}
              />
              <ProfileDetail
                icon={<Shield size={14} />}
                label="Role"
                value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              />
              <ProfileDetail
                icon={<Calendar size={14} />}
                label="Member Since"
                value={format(new Date(user.createdAt), 'MMMM d, yyyy')}
              />
              {user.lastLogin && (
                <ProfileDetail
                  icon={<Calendar size={14} />}
                  label="Last Login"
                  value={format(new Date(user.lastLogin), 'MMMM d, yyyy, h:mm a')}
                />
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

const ProfileDetail = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}): JSX.Element => (
  <div className="flex items-center gap-3 py-3 border-b border-hairline last:border-0 dark:border-dark-border">
    <div className="flex-shrink-0 text-mute dark:text-gray-500">{icon}</div>
    <div className="flex-1">
      <p className="text-xs text-mute dark:text-gray-500">{label}</p>
      <p className="text-sm font-medium text-ink dark:text-white mt-0.5">{value}</p>
    </div>
  </div>
);
