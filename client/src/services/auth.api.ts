import { apiClient } from './api.client';
import { API_ROUTES } from '../constants';
import { ApiResponse, AuthResponse, LoginDto, RegisterDto, User } from '../types';

export const authApi = {
  register: async (dto: RegisterDto): Promise<AuthResponse> => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      API_ROUTES.AUTH.REGISTER,
      dto
    );
    return data.data!;
  },

  login: async (dto: LoginDto): Promise<AuthResponse> => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      API_ROUTES.AUTH.LOGIN,
      dto
    );
    return data.data!;
  },

  getProfile: async (): Promise<User> => {
    const { data } = await apiClient.get<ApiResponse<{ user: User }>>(
      API_ROUTES.AUTH.PROFILE
    );
    return data.data!.user;
  },

  getAllUsers: async (): Promise<User[]> => {
    const { data } = await apiClient.get<ApiResponse<{ users: User[] }>>(
      API_ROUTES.AUTH.USERS
    );
    return data.data!.users;
  },

  updateUserRole: async (userId: string, role: string): Promise<User> => {
    const { data } = await apiClient.patch<ApiResponse<{ user: User }>>(
      `${API_ROUTES.AUTH.USERS}/${userId}/role`,
      { role }
    );
    return data.data!.user;
  },

  deactivateUser: async (userId: string): Promise<void> => {
    await apiClient.delete(`${API_ROUTES.AUTH.USERS}/${userId}`);
  },
};
