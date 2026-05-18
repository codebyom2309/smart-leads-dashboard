import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { leadsApi } from '../services/leads.api';
import { Lead, LeadFilters, CreateLeadDto, UpdateLeadDto } from '../types';
import { useDebounce } from './useDebounce';
import { DEFAULT_PAGE_SIZE } from '../constants';

export const LEADS_QUERY_KEY = 'leads';
export const LEAD_STATS_KEY = 'lead-stats';

export const useLeadsFilters = () => {
  const [filters, setFilters] = useState<LeadFilters>({
    page: 1,
    limit: DEFAULT_PAGE_SIZE,
    sortOrder: 'desc',
    sortBy: 'createdAt',
  });

  const updateFilter = useCallback(<K extends keyof LeadFilters>(
    key: K,
    value: LeadFilters[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: key === 'page' ? (value as number) : 1 }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      page: 1,
      limit: DEFAULT_PAGE_SIZE,
      sortOrder: 'desc',
      sortBy: 'createdAt',
    });
  }, []);

  return { filters, updateFilter, resetFilters, setFilters };
};

export const useLeads = (filters: LeadFilters) => {
  const debouncedSearch = useDebounce(filters.search ?? '', 400);

  const queryFilters = {
    ...filters,
    search: debouncedSearch,
  };

  return useQuery({
    queryKey: [LEADS_QUERY_KEY, queryFilters],
    queryFn: () => leadsApi.getAll(queryFilters),
    placeholderData: (prev) => prev,
    staleTime: 30_000,
  });
};

export const useLead = (id: string) => {
  return useQuery({
    queryKey: [LEADS_QUERY_KEY, id],
    queryFn: () => leadsApi.getById(id),
    enabled: !!id,
  });
};

export const useLeadStats = () => {
  return useQuery({
    queryKey: [LEAD_STATS_KEY],
    queryFn: leadsApi.getStats,
    staleTime: 60_000,
  });
};

export const useCreateLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateLeadDto) => leadsApi.create(dto),
    onSuccess: (newLead: Lead) => {
      queryClient.invalidateQueries({ queryKey: [LEADS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [LEAD_STATS_KEY] });
      toast.success(`Lead "${newLead.name}" created successfully`);
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message ?? 'Failed to create lead');
    },
  });
};

export const useUpdateLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateLeadDto }) =>
      leadsApi.update(id, dto),
    onSuccess: (updatedLead: Lead) => {
      queryClient.invalidateQueries({ queryKey: [LEADS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [LEAD_STATS_KEY] });
      queryClient.setQueryData([LEADS_QUERY_KEY, updatedLead._id], updatedLead);
      toast.success(`Lead "${updatedLead.name}" updated successfully`);
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message ?? 'Failed to update lead');
    },
  });
};

export const useDeleteLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => leadsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LEADS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [LEAD_STATS_KEY] });
      toast.success('Lead deleted successfully');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message ?? 'Failed to delete lead');
    },
  });
};

export const useExportLeads = () => {
  const [isExporting, setIsExporting] = useState(false);

  const exportCsv = useCallback(async (filters: LeadFilters = {}) => {
    setIsExporting(true);
    try {
      const blob = await leadsApi.exportCsv(filters);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success('CSV exported successfully');
    } catch {
      toast.error('Failed to export CSV');
    } finally {
      setIsExporting(false);
    }
  }, []);

  return { exportCsv, isExporting };
};
