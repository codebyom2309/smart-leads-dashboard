import { body, query, param } from 'express-validator';

export const registerValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),

  body('role')
    .optional()
    .isIn(['admin', 'sales'])
    .withMessage('Role must be either admin or sales'),
];

export const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

export const createLeadValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Lead name is required')
    .isLength({ min: 2, max: 150 })
    .withMessage('Name must be between 2 and 150 characters'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['New', 'Contacted', 'Qualified', 'Lost'])
    .withMessage('Status must be one of: New, Contacted, Qualified, Lost'),

  body('source')
    .notEmpty()
    .withMessage('Source is required')
    .isIn(['Website', 'Instagram', 'Referral'])
    .withMessage('Source must be one of: Website, Instagram, Referral'),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Notes cannot exceed 2000 characters'),

  body('phone')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Phone cannot exceed 20 characters'),

  body('company')
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage('Company cannot exceed 150 characters'),
];

export const updateLeadValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 150 })
    .withMessage('Name must be between 2 and 150 characters'),

  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('status')
    .optional()
    .isIn(['New', 'Contacted', 'Qualified', 'Lost'])
    .withMessage('Status must be one of: New, Contacted, Qualified, Lost'),

  body('source')
    .optional()
    .isIn(['Website', 'Instagram', 'Referral'])
    .withMessage('Source must be one of: Website, Instagram, Referral'),

  body('notes')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Notes cannot exceed 2000 characters'),
];

export const leadQueryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  query('status')
    .optional()
    .isIn(['New', 'Contacted', 'Qualified', 'Lost'])
    .withMessage('Invalid status filter'),

  query('source')
    .optional()
    .isIn(['Website', 'Instagram', 'Referral'])
    .withMessage('Invalid source filter'),

  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
];

export const mongoIdValidation = (field = 'id') => [
  param(field)
    .isMongoId()
    .withMessage(`Invalid ${field} format`),
];
