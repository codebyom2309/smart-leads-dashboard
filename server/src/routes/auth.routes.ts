import { Router } from 'express';
import {
  register,
  login,
  refreshToken,
  getProfile,
  getAllUsers,
  updateUserRole,
  deactivateUser,
} from '../controllers/auth.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { registerValidation, loginValidation, mongoIdValidation } from '../middleware/validators';
import { body } from 'express-validator';

const router = Router();

// Public routes
router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.post('/refresh', refreshToken);

// Protected routes
router.get('/profile', authenticate, getProfile);

// Admin only routes
router.get('/users', authenticate, authorize('admin'), getAllUsers);
router.patch(
  '/users/:id/role',
  authenticate,
  authorize('admin'),
  mongoIdValidation('id'),
  [body('role').isIn(['admin', 'sales']).withMessage('Role must be admin or sales')],
  validate,
  updateUserRole
);
router.delete(
  '/users/:id',
  authenticate,
  authorize('admin'),
  mongoIdValidation('id'),
  validate,
  deactivateUser
);

export default router;
