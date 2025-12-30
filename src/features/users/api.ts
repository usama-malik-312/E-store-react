import { axiosInstance } from '@/lib/axios';
import { UsersFilters, User, CreateUserData, UpdateUserData } from './types';
import { ApiResponse, unwrapResponse, unwrapPaginatedResponse } from '@/utils/apiResponse';

export const usersApi = {
  /**
   * Get users with pagination, filters, and search
   */
  getUsers: async (
    filters: UsersFilters = {},
    page: number = 1,
    limit: number = 20
  ): Promise<{
    data: User[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> => {
    const response = await axiosInstance.get<ApiResponse<User[]>>('/users', {
      params: {
        ...filters,
        page,
        limit,
        search: filters.search,
        sort: filters.sort || 'created_at:DESC',
      },
    });
    return unwrapPaginatedResponse(response.data);
  },

  /**
   * Get user by ID
   */
  getUserById: async (id: number): Promise<User> => {
    const response = await axiosInstance.get<ApiResponse<User>>(`/users/${id}`);
    return unwrapResponse(response.data);
  },

  /**
   * Create user
   */
  createUser: async (data: CreateUserData): Promise<User> => {
    const response = await axiosInstance.post<ApiResponse<User>>('/users', data);
    return unwrapResponse(response.data);
  },

  /**
   * Update user
   */
  updateUser: async (id: number, data: UpdateUserData): Promise<User> => {
    const response = await axiosInstance.put<ApiResponse<User>>(`/users/${id}`, data);
    return unwrapResponse(response.data);
  },

  /**
   * Delete user
   */
  deleteUser: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/users/${id}`);
  },
};

