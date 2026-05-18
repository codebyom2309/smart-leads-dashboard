import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public errors?: Record<string, string>[];

  constructor(
    message: string,
    statusCode: number,
    errors?: Record<string, string>[]
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    const response: ApiResponse = {
      success: false,
      message: err.message,
      errors: err.errors,
    };
    res.status(err.statusCode).json(response);
    return;
  }

  // Mongoose duplicate key error
  if ((err as NodeJS.ErrnoException).name === 'MongoServerError' && (err as { code?: number }).code === 11000) {
    const field = Object.keys((err as { keyValue?: Record<string, unknown> }).keyValue ?? {})[0] ?? 'field';
    res.status(409).json({
      success: false,
      message: `A record with this ${field} already exists.`,
    });
    return;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values((err as { errors?: Record<string, { message: string }> }).errors ?? {}).map(
      (e) => ({ [e.message]: e.message })
    );
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
    return;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({ success: false, message: 'Invalid token' });
    return;
  }

  if (err.name === 'TokenExpiredError') {
    res.status(401).json({ success: false, message: 'Token expired' });
    return;
  }

  // Default 500 error
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'An internal server error occurred',
  });
};

export const asyncHandler = <T extends Request>(
  fn: (req: T, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: T, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
