import { LeadStatus, LeadSource } from '../types';

export const LEAD_STATUSES: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost'];
export const LEAD_SOURCES: LeadSource[] = ['Website', 'Instagram', 'Referral'];
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
export const DEFAULT_PAGE_SIZE = 10;
export const DEBOUNCE_DELAY = 400;

export const STATUS_CONFIG: Record<LeadStatus, {
  label: string;
  className: string;
  dotColor: string;
}> = {
  New: {
    label: 'New',
    className: 'badge-new',
    dotColor: 'bg-primary-400',
  },
  Contacted: {
    label: 'Contacted',
    className: 'badge-contacted',
    dotColor: 'bg-blue-400',
  },
  Qualified: {
    label: 'Qualified',
    className: 'badge-qualified',
    dotColor: 'bg-emerald-400',
  },
  Lost: {
    label: 'Lost',
    className: 'badge-lost',
    dotColor: 'bg-red-400',
  },
};

export const SOURCE_CONFIG: Record<LeadSource, {
  label: string;
  className: string;
  icon: string;
}> = {
  Website: {
    label: 'Website',
    className: 'badge-website',
    icon: '🌐',
  },
  Instagram: {
    label: 'Instagram',
    className: 'badge-instagram',
    icon: '📸',
  },
  Referral: {
    label: 'Referral',
    className: 'badge-referral',
    icon: '🤝',
  },
};

export const STATUS_CHART_COLORS: Record<LeadStatus, string> = {
  New: '#6366f1',
  Contacted: '#3b82f6',
  Qualified: '#10b981',
  Lost: '#ef4444',
};

export const SOURCE_CHART_COLORS: Record<LeadSource, string> = {
  Website: '#8b5cf6',
  Instagram: '#ec4899',
  Referral: '#f59e0b',
};

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'sld_access_token',
  REFRESH_TOKEN: 'sld_refresh_token',
  THEME: 'sld_theme',
  USER: 'sld_user',
} as const;

export const API_ROUTES = {
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    REFRESH: '/api/auth/refresh',
    PROFILE: '/api/auth/profile',
    USERS: '/api/auth/users',
  },
  LEADS: {
    BASE: '/api/leads',
    STATS: '/api/leads/stats',
    EXPORT: '/api/leads/export',
    BY_ID: (id: string) => `/api/leads/${id}`,
  },
} as const;
