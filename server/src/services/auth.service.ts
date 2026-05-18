import { User, IUser } from '../models/User';
import { ActivityLog } from '../models/ActivityLog';
import { AppError } from '../utils/errors';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { CreateUserDto, LoginDto, UserRole } from '../types';

interface AuthResult {
  user: Omit<IUser, 'password'>;
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  async register(dto: CreateUserDto, ipAddress?: string): Promise<AuthResult> {
    const existingUser = await User.findOne({ email: dto.email });
    if (existingUser) {
      throw new AppError('An account with this email already exists', 409);
    }

    const user = await User.create({
      name: dto.name,
      email: dto.email,
      password: dto.password,
      role: dto.role ?? 'sales',
    });

    await ActivityLog.create({
      action: 'created',
      entityType: 'user',
      entityId: user._id,
      userId: user._id,
      ipAddress,
    });

    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    return { user, accessToken, refreshToken };
  }

  async login(dto: LoginDto, ipAddress?: string): Promise<AuthResult> {
    const user = await User.findOne({ email: dto.email }).select('+password');

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    if (!user.isActive) {
      throw new AppError('Your account has been deactivated. Please contact support.', 403);
    }

    const isPasswordValid = await user.comparePassword(dto.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    return { user, accessToken, refreshToken };
  }

  async refreshTokens(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const decoded = verifyRefreshToken(refreshToken);

    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      throw new AppError('Invalid refresh token', 401);
    }

    const tokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: generateAccessToken(tokenPayload),
      refreshToken: generateRefreshToken(tokenPayload),
    };
  }

  async getProfile(userId: string): Promise<IUser> {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  async getAllUsers(): Promise<IUser[]> {
    return User.find({ isActive: true }).sort({ createdAt: -1 });
  }

  async updateUserRole(targetUserId: string, role: UserRole, requestingUserId: string): Promise<IUser> {
    if (targetUserId === requestingUserId) {
      throw new AppError('You cannot change your own role', 400);
    }

    const user = await User.findByIdAndUpdate(
      targetUserId,
      { role },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new AppError('User not found', 404);
    }

    await ActivityLog.create({
      action: 'updated',
      entityType: 'user',
      entityId: targetUserId,
      userId: requestingUserId,
      changes: { role },
    });

    return user;
  }

  async deactivateUser(targetUserId: string, requestingUserId: string): Promise<void> {
    if (targetUserId === requestingUserId) {
      throw new AppError('You cannot deactivate your own account', 400);
    }

    const user = await User.findByIdAndUpdate(targetUserId, { isActive: false });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    await ActivityLog.create({
      action: 'updated',
      entityType: 'user',
      entityId: targetUserId,
      userId: requestingUserId,
      changes: { isActive: false },
    });
  }
}

export const authService = new AuthService();
