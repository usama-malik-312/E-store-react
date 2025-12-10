import { axiosInstance } from '@/lib/axios';
import { UsersFilters, UsersResponse, User, CreateUserData, UpdateUserData } from './types';

export const usersApi = {
  /**
   * Get users with pagination, filters, and search
   */
  getUsers: async (
    filters: UsersFilters = {},
    page: number = 1,
    limit: number = 20
  ): Promise<UsersResponse> => {
    const response = await axiosInstance.get<UsersResponse>('/users', {
      params: {
        ...filters,
        page,
        limit,
      },
    });
    return response.data;
  },

  /**
   * Get user by ID
   */
  getUserById: async (id: number): Promise<User> => {
    const response = await axiosInstance.get<User>(`/users/${id}`);
    return response.data;
  },

  /**
   * Create user
   */
  createUser: async (data: CreateUserData): Promise<User> => {
    const response = await axiosInstance.post<User>('/users', data);
    return response.data;
  },

  /**
   * Update user
   */
  updateUser: async (id: number, data: UpdateUserData): Promise<User> => {
    const response = await axiosInstance.put<User>(`/users/${id}`, data);
    return response.data;
  },

  /**
   * Delete user
   */
  deleteUser: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/users/${id}`);
  },
};

