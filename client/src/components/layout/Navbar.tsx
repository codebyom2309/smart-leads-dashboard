import React from 'react';
import { Menu, Moon, Sun, Bell } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

interface NavbarProps {
  onMenuToggle: () => void;
  pageTitle?: string;
}

export const Navbar = ({ onMenuToggle, pageTitle }: NavbarProps): JSX.Element => {
  const { toggleTheme, isDark } = useTheme();
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 lg:px-6 bg-white/80 dark:bg-dark-surface/80 border-b border-hairline dark:border-dark-border backdrop-blur-md">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden btn-ghost p-2 -ml-1"
          aria-label="Toggle menu"
        >
          <Menu size={18} />
        </button>
        {pageTitle && (
          <h1 className="text-sm font-semibold text-ink dark:text-white hidden sm:block tracking-tight">
            {pageTitle}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        {/* Theme toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className="btn-ghost p-2 rounded-lg"
          aria-label="Toggle theme"
        >
          <motion.div
            key={isDark ? 'dark' : 'light'}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {isDark ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} />}
          </motion.div>
        </motion.button>

        {/* Notification bell - visual only */}
        <button className="btn-ghost p-2 rounded-lg relative" aria-label="Notifications">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-2 ml-1 pl-3 border-l border-hairline dark:border-dark-border">
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent text-white text-xs font-semibold">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-medium text-ink dark:text-white leading-none">{user?.name}</p>
            <p className="text-xs text-mute dark:text-gray-500 capitalize leading-none mt-0.5">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
