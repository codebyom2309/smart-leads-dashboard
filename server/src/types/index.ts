// Shared TypeScript types and interfaces for the server

export type UserRole = 'admin' | 'sales';

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';

export type LeadSource = 'Website' | 'Instagram' | 'Referral';

export type SortOrder = 'asc' | 'desc';

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
}

export interface LeadFilterQuery extends PaginationQuery {
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
  startDate?: string;
  endDate?: string;
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
  errors?: Record<string, string>[];
}

export interface LeadDocument {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
  phone?: string;
  company?: string;
  assignedTo?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLeadDto {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
  phone?: string;
  company?: string;
  assignedTo?: string;
}

export interface UpdateLeadDto extends Partial<CreateLeadDto> {}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface ActivityLog {
  action: 'created' | 'updated' | 'deleted';
  entityType: 'lead' | 'user';
  entityId: string;
  userId: string;
  changes?: Record<string, unknown>;
  timestamp: Date;
}
