import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Settings, Shield, Trash2, UserCheck } from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { authApi } from '../../services/auth.api';
import { User, UserRole } from '../../types';
import { RoleBadge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export const AdminUsersPage = (): JSX.Element => {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<User | null>(null);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: authApi.getAllUsers,
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: UserRole }) =>
      authApi.updateUserRole(userId, role),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success(`Role updated for ${updatedUser.name}`);
      setSelectedUser(null);
    },
    onError: () => toast.error('Failed to update role'),
  });

  const deactivateMutation = useMutation({
    mutationFn: (userId: string) => authApi.deactivateUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deactivated');
      setDeactivateTarget(null);
    },
    onError: () => toast.error('Failed to deactivate user'),
  });

  return (
    <DashboardLayout pageTitle="User Management">
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-1.5 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <Settings size={16} className="text-amber-600 dark:text-amber-400" />
            </div>
            <h1 className="section-title">User Management</h1>
          </div>
          <p className="section-subtitle">Manage user roles and permissions.</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="card overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-canvas-soft dark:bg-dark-hover">
                <th className="table-header text-left">User</th>
                <th className="table-header text-left">Role</th>
                <th className="table-header text-left">Status</th>
                <th className="table-header text-left">Joined</th>
                <th className="table-header text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="table-row">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="table-cell">
                        <div className="skeleton h-4 rounded w-24" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-ink dark:text-white">
                            {user.name}
                            {user._id === currentUser?._id && (
                              <span className="ml-1 text-xs text-mute">(you)</span>
                            )}
                          </p>
                          <p className="text-xs text-mute dark:text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="table-cell">
                      <span className={`badge ${user.isActive ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : 'bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="table-cell text-xs text-mute dark:text-gray-500 font-mono">
                      {format(new Date(user.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td className="table-cell">
                      {user._id !== currentUser?._id && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="btn-ghost p-1.5 text-xs"
                            title="Change role"
                          >
                            <Shield size={13} />
                          </button>
                          {user.isActive && (
                            <button
                              onClick={() => setDeactivateTarget(user)}
                              className="p-1.5 rounded-lg text-error hover:bg-error-soft dark:hover:bg-red-900/20 transition-colors"
                              title="Deactivate user"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Change Role Modal */}
      <Modal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title="Change User Role"
        size="sm"
      >
        {selectedUser && (
          <div className="space-y-4">
            <p className="text-sm text-body dark:text-gray-300">
              Change role for <span className="font-semibold text-ink dark:text-white">{selectedUser.name}</span>
            </p>
            <div className="space-y-2">
              {(['admin', 'sales'] as UserRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => updateRoleMutation.mutate({ userId: selectedUser._id, role })}
                  disabled={selectedUser.role === role || updateRoleMutation.isPending}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                    selectedUser.role === role
                      ? 'border-primary bg-primary-50 text-primary dark:bg-primary-900/30 dark:text-primary-300 dark:border-primary-700'
                      : 'border-hairline dark:border-dark-border text-body dark:text-gray-300 hover:border-primary hover:bg-primary-50 dark:hover:bg-primary-900/20 dark:hover:text-primary-300'
                  }`}
                >
                  {role === 'admin' ? <Shield size={15} /> : <UserCheck size={15} />}
                  <span className="text-sm font-medium capitalize">{role}</span>
                  {selectedUser.role === role && (
                    <span className="ml-auto text-xs text-primary">Current</span>
                  )}
                </button>
              ))}
            </div>
            <button onClick={() => setSelectedUser(null)} className="btn-secondary w-full">
              Cancel
            </button>
          </div>
        )}
      </Modal>

      {/* Deactivate Modal */}
      <Modal
        isOpen={!!deactivateTarget}
        onClose={() => setDeactivateTarget(null)}
        title="Deactivate User"
        size="sm"
      >
        {deactivateTarget && (
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-error-soft dark:bg-red-900/20">
              <Trash2 size={18} className="text-error" />
            </div>
            <p className="text-sm text-body dark:text-gray-300">
              Deactivate <span className="font-semibold text-ink dark:text-white">{deactivateTarget.name}</span>?
              They will no longer be able to sign in.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeactivateTarget(null)} className="btn-secondary flex-1">Cancel</button>
              <button
                onClick={() => deactivateMutation.mutate(deactivateTarget._id)}
                disabled={deactivateMutation.isPending}
                className="btn-danger flex-1"
              >
                {deactivateMutation.isPending ? 'Deactivating...' : 'Deactivate'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};
