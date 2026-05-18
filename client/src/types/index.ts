// Shared TypeScript types for the client

export type UserRole = 'admin' | 'sales';
export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';
export type LeadSource = 'Website' | 'Instagram' | 'Referral';
export type SortOrder = 'asc' | 'desc';
export type Theme = 'light' | 'dark';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
  phone?: string;
  company?: string;
  assignedTo?: User | null;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: PaginationMeta;
  errors?: Array<{ field: string; message: string }>;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LeadFilters {
  status?: LeadStatus | '';
  source?: LeadSource | '';
  search?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface LeadStats {
  total: number;
  byStatus: Record<LeadStatus, number>;
  bySource: Record<LeadSource, number>;
  recentActivity: number;
}

export interface CreateLeadDto {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
  phone?: string;
  company?: string;
}

export interface UpdateLeadDto extends Partial<CreateLeadDto> {}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginDto {
  email: string;
  password: string;
}

export type NotificationType = 'success' | 'error' | 'info' | 'warning';
