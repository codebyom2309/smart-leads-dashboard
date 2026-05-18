import { Router } from 'express';
import {
  createLead,
  getLeads,
  getLead,
  updateLead,
  deleteLead,
  getLeadStats,
  exportLeads,
} from '../controllers/lead.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  createLeadValidation,
  updateLeadValidation,
  leadQueryValidation,
  mongoIdValidation,
} from '../middleware/validators';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Stats and export
router.get('/stats', getLeadStats);
router.get('/export', exportLeads);

// CRUD
router.get('/', leadQueryValidation, validate, getLeads);
router.post('/', createLeadValidation, validate, createLead);
router.get('/:id', mongoIdValidation('id'), validate, getLead);
router.put('/:id', mongoIdValidation('id'), updateLeadValidation, validate, updateLead);
router.delete('/:id', mongoIdValidation('id'), validate, deleteLead);

export default router;
