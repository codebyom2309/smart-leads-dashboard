import { Request, Response, NextFunction } from 'express';
import { leadService } from '../services/lead.service';
import { asyncHandler } from '../utils/errors';
import { sendSuccess } from '../utils/response';
import { CreateLeadDto, UpdateLeadDto, LeadFilterQuery } from '../types';

export const createLead = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const dto = req.body as CreateLeadDto;
  const userId = req.user!.userId;

  const lead = await leadService.create(dto, userId);
  sendSuccess(res, { lead }, 'Lead created successfully', 201);
});

export const getLeads = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const query = req.query as unknown as LeadFilterQuery;
  const { userId, role } = req.user!;

  const { leads, pagination } = await leadService.findAll(query, userId, role);
  sendSuccess(res, { leads }, 'Leads retrieved successfully', 200, pagination);
});

export const getLead = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const { id } = req.params;
  const { userId, role } = req.user!;

  const lead = await leadService.findById(id, userId, role);
  sendSuccess(res, { lead }, 'Lead retrieved successfully');
});

export const updateLead = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const { id } = req.params;
  const dto = req.body as UpdateLeadDto;
  const { userId, role } = req.user!;

  const lead = await leadService.update(id, dto, userId, role);
  sendSuccess(res, { lead }, 'Lead updated successfully');
});

export const deleteLead = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const { id } = req.params;
  const { userId, role } = req.user!;

  await leadService.delete(id, userId, role);
  sendSuccess(res, null, 'Lead deleted successfully');
});

export const getLeadStats = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const { userId, role } = req.user!;

  const stats = await leadService.getStats(userId, role);
  sendSuccess(res, { stats }, 'Stats retrieved successfully');
});

export const exportLeads = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const query = req.query as unknown as LeadFilterQuery;
  const { userId, role } = req.user!;

  const csv = await leadService.exportToCsv(query, userId, role);

  const filename = `leads-export-${new Date().toISOString().split('T')[0]}.csv`;

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.status(200).send(csv);
});
