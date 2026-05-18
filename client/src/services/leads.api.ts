import { apiClient } from './api.client';
import { API_ROUTES } from '../constants';
import {
  ApiResponse,
  Lead,
  LeadFilters,
  LeadStats,
  CreateLeadDto,
  UpdateLeadDto,
  PaginationMeta,
} from '../types';

interface LeadListResponse {
  leads: Lead[];
  pagination: PaginationMeta;
}

const buildParams = (filters: LeadFilters): Record<string, string> => {
  const params: Record<string, string> = {};

  if (filters.status) params.status = filters.status;
  if (filters.source) params.source = filters.source;
  if (filters.search) params.search = filters.search;
  if (filters.sortBy) params.sortBy = filters.sortBy;
  if (filters.sortOrder) params.sortOrder = filters.sortOrder;
  if (filters.startDate) params.startDate = filters.startDate;
  if (filters.endDate) params.endDate = filters.endDate;
  if (filters.page) params.page = String(filters.page);
  if (filters.limit) params.limit = String(filters.limit);

  return params;
};

export const leadsApi = {
  getAll: async (filters: LeadFilters = {}): Promise<LeadListResponse> => {
    const { data } = await apiClient.get<ApiResponse<{ leads: Lead[] }>>(
      API_ROUTES.LEADS.BASE,
      { params: buildParams(filters) }
    );
    return {
      leads: data.data!.leads,
      pagination: data.pagination!,
    };
  },

  getById: async (id: string): Promise<Lead> => {
    const { data } = await apiClient.get<ApiResponse<{ lead: Lead }>>(
      API_ROUTES.LEADS.BY_ID(id)
    );
    return data.data!.lead;
  },

  create: async (dto: CreateLeadDto): Promise<Lead> => {
    const { data } = await apiClient.post<ApiResponse<{ lead: Lead }>>(
      API_ROUTES.LEADS.BASE,
      dto
    );
    return data.data!.lead;
  },

  update: async (id: string, dto: UpdateLeadDto): Promise<Lead> => {
    const { data } = await apiClient.put<ApiResponse<{ lead: Lead }>>(
      API_ROUTES.LEADS.BY_ID(id),
      dto
    );
    return data.data!.lead;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(API_ROUTES.LEADS.BY_ID(id));
  },

  getStats: async (): Promise<LeadStats> => {
    const { data } = await apiClient.get<ApiResponse<{ stats: LeadStats }>>(
      API_ROUTES.LEADS.STATS
    );
    return data.data!.stats;
  },

  exportCsv: async (filters: LeadFilters = {}): Promise<Blob> => {
    const { data } = await apiClient.get<Blob>(API_ROUTES.LEADS.EXPORT, {
      params: buildParams(filters),
      responseType: 'blob',
    });
    return data;
  },
};
