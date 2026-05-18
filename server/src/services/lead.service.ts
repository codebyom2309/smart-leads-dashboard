import { FilterQuery, SortOrder as MongoSortOrder } from 'mongoose';
import { Lead, ILead } from '../models/Lead';
import { ActivityLog } from '../models/ActivityLog';
import { AppError } from '../utils/errors';
import { buildPaginationMeta } from '../utils/response';
import {
  CreateLeadDto,
  UpdateLeadDto,
  LeadFilterQuery,
  PaginationMeta,
  LeadStatus,
  LeadSource,
} from '../types';

interface LeadListResult {
  leads: ILead[];
  pagination: PaginationMeta;
}

interface LeadStats {
  total: number;
  byStatus: Record<LeadStatus, number>;
  bySource: Record<LeadSource, number>;
  recentActivity: number;
}

export class LeadService {
  async create(dto: CreateLeadDto, userId: string): Promise<ILead> {
    const lead = await Lead.create({
      ...dto,
      createdBy: userId,
    });

    await ActivityLog.create({
      action: 'created',
      entityType: 'lead',
      entityId: lead._id,
      userId,
    });

    return lead.populate(['createdBy', 'assignedTo']);
  }

  async findAll(query: LeadFilterQuery, userId: string, role: string): Promise<LeadListResult> {
    const page = Math.max(1, parseInt(query.page ?? '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(query.limit ?? '10', 10)));
    const skip = (page - 1) * limit;

    const filter: FilterQuery<ILead> = {};

    // Sales users can only see their own leads
    if (role === 'sales') {
      filter.$or = [{ createdBy: userId }, { assignedTo: userId }];
    }

    // Status filter
    if (query.status) {
      filter.status = query.status;
    }

    // Source filter
    if (query.source) {
      filter.source = query.source;
    }

    // Date range filter
    if (query.startDate ?? query.endDate) {
      filter.createdAt = {};
      if (query.startDate) {
        filter.createdAt.$gte = new Date(query.startDate);
      }
      if (query.endDate) {
        const endDate = new Date(query.endDate);
        endDate.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = endDate;
      }
    }

    // Text search
    if (query.search?.trim()) {
      const searchRegex = new RegExp(query.search.trim(), 'i');
      const searchFilter = {
        $or: [
          { name: searchRegex },
          { email: searchRegex },
          { company: searchRegex },
        ],
      };

      if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, searchFilter];
        delete filter.$or;
      } else {
        Object.assign(filter, searchFilter);
      }
    }

    // Sorting
    const sortField = query.sortBy ?? 'createdAt';
    const sortOrderValue: MongoSortOrder = query.sortOrder === 'asc' ? 1 : -1;
    const sort: Record<string, MongoSortOrder> = { [sortField]: sortOrderValue };

    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email')
        .lean(),
      Lead.countDocuments(filter),
    ]);

    return {
      leads: leads as unknown as ILead[],
      pagination: buildPaginationMeta(total, page, limit),
    };
  }

  async findById(id: string, userId: string, role: string): Promise<ILead> {
    const lead = await Lead.findById(id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    if (!lead) {
      throw new AppError('Lead not found', 404);
    }

    // Sales users can only view their own leads
    if (
      role === 'sales' &&
      lead.createdBy.toString() !== userId &&
      lead.assignedTo?.toString() !== userId
    ) {
      throw new AppError('You do not have permission to view this lead', 403);
    }

    return lead;
  }

  async update(
    id: string,
    dto: UpdateLeadDto,
    userId: string,
    role: string
  ): Promise<ILead> {
    const lead = await Lead.findById(id);

    if (!lead) {
      throw new AppError('Lead not found', 404);
    }

    // Sales users can only update their own leads
    if (
      role === 'sales' &&
      lead.createdBy.toString() !== userId
    ) {
      throw new AppError('You do not have permission to update this lead', 403);
    }

    const changes: Record<string, unknown> = {};
    (Object.keys(dto) as Array<keyof UpdateLeadDto>).forEach((key) => {
      if (dto[key] !== undefined && dto[key] !== (lead as unknown as Record<string, unknown>)[key]) {
        changes[key] = { from: (lead as unknown as Record<string, unknown>)[key], to: dto[key] };
      }
    });

    const updatedLead = await Lead.findByIdAndUpdate(id, dto, {
      new: true,
      runValidators: true,
    })
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    if (Object.keys(changes).length > 0) {
      await ActivityLog.create({
        action: 'updated',
        entityType: 'lead',
        entityId: id,
        userId,
        changes,
      });
    }

    return updatedLead!;
  }

  async delete(id: string, userId: string, role: string): Promise<void> {
    const lead = await Lead.findById(id);

    if (!lead) {
      throw new AppError('Lead not found', 404);
    }

    // Only admins or the creator can delete
    if (role === 'sales' && lead.createdBy.toString() !== userId) {
      throw new AppError('You do not have permission to delete this lead', 403);
    }

    await lead.deleteOne();

    await ActivityLog.create({
      action: 'deleted',
      entityType: 'lead',
      entityId: id,
      userId,
    });
  }

  async getStats(userId: string, role: string): Promise<LeadStats> {
    const matchFilter: FilterQuery<ILead> =
      role === 'sales'
        ? { $or: [{ createdBy: userId }, { assignedTo: userId }] }
        : {};

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [statusCounts, sourceCounts, total, recentActivity] = await Promise.all([
      Lead.aggregate([
        { $match: matchFilter },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Lead.aggregate([
        { $match: matchFilter },
        { $group: { _id: '$source', count: { $sum: 1 } } },
      ]),
      Lead.countDocuments(matchFilter),
      Lead.countDocuments({ ...matchFilter, createdAt: { $gte: thirtyDaysAgo } }),
    ]);

    const byStatus: Record<LeadStatus, number> = {
      New: 0,
      Contacted: 0,
      Qualified: 0,
      Lost: 0,
    };

    const bySource: Record<LeadSource, number> = {
      Website: 0,
      Instagram: 0,
      Referral: 0,
    };

    statusCounts.forEach(({ _id, count }: { _id: LeadStatus; count: number }) => {
      if (_id in byStatus) byStatus[_id] = count;
    });

    sourceCounts.forEach(({ _id, count }: { _id: LeadSource; count: number }) => {
      if (_id in bySource) bySource[_id] = count;
    });

    return { total, byStatus, bySource, recentActivity };
  }

  async exportToCsv(query: LeadFilterQuery, userId: string, role: string): Promise<string> {
    const { leads } = await this.findAll(
      { ...query, page: '1', limit: '10000' },
      userId,
      role
    );

    const headers = ['Name', 'Email', 'Status', 'Source', 'Company', 'Phone', 'Notes', 'Created At'];

    const rows = leads.map((lead) => [
      `"${lead.name.replace(/"/g, '""')}"`,
      `"${lead.email.replace(/"/g, '""')}"`,
      `"${lead.status}"`,
      `"${lead.source}"`,
      `"${(lead.company ?? '').replace(/"/g, '""')}"`,
      `"${(lead.phone ?? '').replace(/"/g, '""')}"`,
      `"${(lead.notes ?? '').replace(/"/g, '""')}"`,
      `"${new Date(lead.createdAt).toISOString()}"`,
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }
}

export const leadService = new LeadService();
