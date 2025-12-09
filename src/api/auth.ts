import { axiosInstance } from '@/lib/axios';
import { tokenStorage } from '@/utils/token';
import { LoginCredentials, LoginResponse, RefreshTokenResponse, User } from '@/types';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post('/auth/logout');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await axiosInstance.get<User>('/auth/me');
    return response.data;
  },

  refreshToken: async (): Promise<RefreshTokenResponse> => {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    const response = await axiosInstance.post<RefreshTokenResponse>('/auth/refresh', {
      refreshToken,
    });
    return response.data;
  },
};

