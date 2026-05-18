import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { asyncHandler } from '../utils/errors';
import { sendSuccess } from '../utils/response';
import { CreateUserDto, LoginDto, UserRole } from '../types';

export const register = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const dto = req.body as CreateUserDto;
  const ipAddress = req.ip ?? req.socket.remoteAddress;

  const result = await authService.register(dto, ipAddress);

  sendSuccess(
    res,
    {
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    },
    'Account created successfully',
    201
  );
});

export const login = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const dto = req.body as LoginDto;
  const ipAddress = req.ip ?? req.socket.remoteAddress;

  const result = await authService.login(dto, ipAddress);

  sendSuccess(
    res,
    {
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    },
    'Login successful'
  );
});

export const refreshToken = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const { refreshToken: token } = req.body as { refreshToken: string };

  if (!token) {
    res.status(400).json({ success: false, message: 'Refresh token required' });
    return;
  }

  const tokens = await authService.refreshTokens(token);
  sendSuccess(res, tokens, 'Tokens refreshed successfully');
});

export const getProfile = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const user = await authService.getProfile(req.user!.userId);
  sendSuccess(res, { user }, 'Profile retrieved successfully');
});

export const getAllUsers = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const users = await authService.getAllUsers();
  sendSuccess(res, { users }, 'Users retrieved successfully');
});

export const updateUserRole = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const { id } = req.params;
  const { role } = req.body as { role: UserRole };

  const user = await authService.updateUserRole(id, role, req.user!.userId);
  sendSuccess(res, { user }, 'User role updated successfully');
});

export const deactivateUser = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const { id } = req.params;
  await authService.deactivateUser(id, req.user!.userId);
  sendSuccess(res, null, 'User deactivated successfully');
});
