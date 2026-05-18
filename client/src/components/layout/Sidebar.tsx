import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users2,
  UserCircle,
  LogOut,
  X,
  Zap,
  Settings,
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../../context/AuthContext';

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  {
    to: '/dashboard',
    icon: <LayoutDashboard size={18} />,
    label: 'Dashboard',
  },
  {
    to: '/leads',
    icon: <Users2 size={18} />,
    label: 'Leads',
  },
  {
    to: '/profile',
    icon: <UserCircle size={18} />,
    label: 'Profile',
  },
  {
    to: '/admin/users',
    icon: <Settings size={18} />,
    label: 'User Management',
    adminOnly: true,
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps): JSX.Element => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (): void => {
    logout();
    navigate('/login');
  };

  const filteredNavItems = navItems.filter(
    (item) => !item.adminOnly || user?.role === 'admin'
  );

  const SidebarContent = (): JSX.Element => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-hairline dark:border-dark-border">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent shadow-glow-sm">
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-semibold text-sm text-ink dark:text-white tracking-tight">
            Smart<span className="gradient-text">Leads</span>
          </span>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg text-mute hover:text-ink hover:bg-canvas-soft-2 transition-colors dark:hover:bg-dark-hover dark:hover:text-white"
        >
          <X size={16} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => onClose()}
            className={({ isActive }) =>
              clsx(isActive ? 'sidebar-link-active' : 'sidebar-link')
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="px-3 py-4 border-t border-hairline dark:border-dark-border">
        <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-xl bg-canvas-soft dark:bg-dark-hover">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-semibold">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-ink dark:text-white truncate">{user?.name}</p>
            <p className="text-xs text-mute dark:text-gray-500 truncate capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium rounded-lg text-error hover:bg-error-soft dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 h-screen sticky top-0 border-r border-hairline dark:border-dark-border bg-white dark:bg-dark-surface flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="lg:hidden fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
              className="lg:hidden fixed left-0 top-0 z-50 h-full w-72 bg-white dark:bg-dark-surface border-r border-hairline dark:border-dark-border"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
