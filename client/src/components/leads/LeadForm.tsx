import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Building, FileText } from 'lucide-react';
import { CreateLeadDto, UpdateLeadDto, Lead, LeadStatus, LeadSource } from '../../types';
import { LEAD_STATUSES, LEAD_SOURCES } from '../../constants';
import { Input, Select, Textarea } from '../ui/FormElements';
import { clsx } from 'clsx';

interface LeadFormProps {
  initialData?: Lead;
  onSubmit: (data: CreateLeadDto | UpdateLeadDto) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

type FormData = CreateLeadDto;

export const LeadForm = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: LeadFormProps): JSX.Element => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: initialData
      ? {
          name: initialData.name,
          email: initialData.email,
          status: initialData.status,
          source: initialData.source,
          notes: initialData.notes ?? '',
          phone: initialData.phone ?? '',
          company: initialData.company ?? '',
        }
      : {
          status: 'New' as LeadStatus,
        },
  });

  const handleFormSubmit = async (data: FormData): Promise<void> => {
    const cleanData: CreateLeadDto = {
      name: data.name,
      email: data.email,
      status: data.status,
      source: data.source,
      ...(data.notes && { notes: data.notes }),
      ...(data.phone && { phone: data.phone }),
      ...(data.company && { company: data.company }),
    };
    await onSubmit(cleanData);
  };

  const statusOptions = LEAD_STATUSES.map((s) => ({ value: s, label: s }));
  const sourceOptions = LEAD_SOURCES.map((s) => ({ value: s, label: s }));

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          placeholder="John Doe"
          required
          icon={<User size={14} />}
          error={errors.name?.message}
          {...register('name', {
            required: 'Name is required',
            minLength: { value: 2, message: 'Name must be at least 2 characters' },
          })}
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="john@example.com"
          required
          icon={<Mail size={14} />}
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: 'Please enter a valid email',
            },
          })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Status"
          required
          options={statusOptions}
          placeholder="Select status"
          error={errors.status?.message}
          {...register('status', { required: 'Status is required' })}
        />
        <Select
          label="Source"
          required
          options={sourceOptions}
          placeholder="Select source"
          error={errors.source?.message}
          {...register('source', { required: 'Source is required' })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Phone"
          type="tel"
          placeholder="+1 (555) 000-0000"
          icon={<Phone size={14} />}
          error={errors.phone?.message}
          {...register('phone')}
        />
        <Input
          label="Company"
          placeholder="Acme Inc."
          icon={<Building size={14} />}
          error={errors.company?.message}
          {...register('company')}
        />
      </div>

      <Textarea
        label="Notes"
        placeholder="Add any relevant notes about this lead..."
        rows={3}
        error={errors.notes?.message}
        {...register('notes')}
      />

      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary flex-1"
          disabled={isSubmitting || isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary flex-1"
          disabled={isSubmitting || isLoading}
        >
          {isSubmitting || isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {initialData ? 'Updating...' : 'Creating...'}
            </span>
          ) : (
            initialData ? 'Update Lead' : 'Create Lead'
          )}
        </button>
      </div>
    </form>
  );
};
