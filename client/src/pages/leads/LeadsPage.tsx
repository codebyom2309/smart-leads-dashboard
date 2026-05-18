import React, { useState } from 'react';
import { Plus, Users2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { LeadTable } from '../../components/leads/LeadTable';
import { FilterBar } from '../../components/leads/FilterBar';
import { LeadForm } from '../../components/leads/LeadForm';
import { LeadDetail } from '../../components/leads/LeadDetail';
import { Modal } from '../../components/ui/Modal';
import { Lead, CreateLeadDto, UpdateLeadDto } from '../../types';
import {
  useLeads,
  useLeadsFilters,
  useCreateLead,
  useUpdateLead,
  useDeleteLead,
  useExportLeads,
} from '../../hooks/useLeads';
import toast from 'react-hot-toast';

type ModalMode = 'create' | 'edit' | 'view' | 'delete' | null;

export const LeadsPage = (): JSX.Element => {
  const { filters, updateFilter, resetFilters } = useLeadsFilters();
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const { data, isLoading } = useLeads(filters);
  const createMutation = useCreateLead();
  const updateMutation = useUpdateLead();
  const deleteMutation = useDeleteLead();
  const { exportCsv, isExporting } = useExportLeads();

  const leads = data?.leads ?? [];
  const pagination = data?.pagination ?? {
    total: 0, page: 1, limit: 10, totalPages: 0, hasNextPage: false, hasPrevPage: false,
  };

  const handleSortChange = (field: string): void => {
    if (filters.sortBy === field) {
      updateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      updateFilter('sortBy', field);
      updateFilter('sortOrder', 'desc');
    }
  };

  const handleCreate = async (dto: CreateLeadDto | UpdateLeadDto): Promise<void> => {
    await createMutation.mutateAsync(dto as CreateLeadDto);
    setModalMode(null);
  };

  const handleUpdate = async (dto: CreateLeadDto | UpdateLeadDto): Promise<void> => {
    if (!selectedLead) return;
    await updateMutation.mutateAsync({ id: selectedLead._id, dto: dto as UpdateLeadDto });
    setModalMode(null);
    setSelectedLead(null);
  };

  const handleDelete = async (): Promise<void> => {
    if (!selectedLead) return;
    await deleteMutation.mutateAsync(selectedLead._id);
    setModalMode(null);
    setSelectedLead(null);
  };

  const openView = (lead: Lead): void => { setSelectedLead(lead); setModalMode('view'); };
  const openEdit = (lead: Lead): void => { setSelectedLead(lead); setModalMode('edit'); };
  const openDelete = (lead: Lead): void => { setSelectedLead(lead); setModalMode('delete'); };
  const openCreate = (): void => { setSelectedLead(null); setModalMode('create'); };

  const closeModal = (): void => {
    setModalMode(null);
    setSelectedLead(null);
  };

  return (
    <DashboardLayout pageTitle="Leads">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-1.5 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <Users2 size={16} className="text-primary dark:text-primary-300" />
            </div>
            <h1 className="section-title">Leads</h1>
          </div>
          <p className="section-subtitle">
            {pagination.total} lead{pagination.total !== 1 ? 's' : ''} total
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          onClick={openCreate}
          className="btn-primary flex-shrink-0"
        >
          <Plus size={15} />
          Add Lead
        </motion.button>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="card p-4 mb-4"
      >
        <FilterBar
          filters={filters}
          onFilterChange={updateFilter}
          onReset={resetFilters}
          onExport={() => exportCsv(filters)}
          isExporting={isExporting}
          totalCount={isLoading ? undefined : pagination.total}
        />
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.3 }}
      >
        <LeadTable
          leads={leads}
          pagination={pagination}
          isLoading={isLoading}
          filters={filters}
          onPageChange={(page) => updateFilter('page', page)}
          onSortChange={handleSortChange}
          onView={openView}
          onEdit={openEdit}
          onDelete={openDelete}
        />
      </motion.div>

      {/* Create Modal */}
      <Modal
        isOpen={modalMode === 'create'}
        onClose={closeModal}
        title="Add New Lead"
        size="lg"
      >
        <LeadForm
          onSubmit={handleCreate}
          onCancel={closeModal}
          isLoading={createMutation.isPending}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={modalMode === 'edit'}
        onClose={closeModal}
        title="Edit Lead"
        size="lg"
      >
        {selectedLead && (
          <LeadForm
            initialData={selectedLead}
            onSubmit={handleUpdate}
            onCancel={closeModal}
            isLoading={updateMutation.isPending}
          />
        )}
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={modalMode === 'view'}
        onClose={closeModal}
        title="Lead Details"
        size="md"
      >
        {selectedLead && (
          <LeadDetail
            lead={selectedLead}
            onEdit={() => { setModalMode('edit'); }}
            onDelete={() => { setModalMode('delete'); }}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={modalMode === 'delete'}
        onClose={closeModal}
        title="Delete Lead"
        size="sm"
      >
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-error-soft dark:bg-red-900/20">
            <span className="text-xl">🗑️</span>
          </div>
          <div>
            <p className="text-sm text-body dark:text-gray-300">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-ink dark:text-white">
                {selectedLead?.name}
              </span>
              ? This action cannot be undone.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={closeModal} className="btn-secondary flex-1">
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="btn-danger flex-1"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
};
