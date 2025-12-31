import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from './api';
import { UsersFilters, CreateUserData, UpdateUserData } from './types';
import { message } from 'antd';

/**
 * Hook to fetch users with pagination, filters, and search
 */
export const useUsers = (filters: UsersFilters = {}, page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ['users', filters, page, limit],
    queryFn: () => usersApi.getUsers(filters, page, limit),
    placeholderData: (previousData) => previousData,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to fetch a single user by ID
 */
export const useUser = (id: number | null) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => usersApi.getUserById(id!),
    enabled: !!id,
  });
};

/**
 * Hook to create a user
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserData) => usersApi.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      message.success('User created successfully');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to create user';
      message.error(errorMessage);
    },
  });
};

/**
 * Hook to update a user
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserData }) =>
      usersApi.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      message.success('User updated successfully');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to update user';
      message.error(errorMessage);
    },
  });
};

/**
 * Hook to delete a user
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => usersApi.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      message.success('User deleted successfully');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to delete user';
      message.error(errorMessage);
    },
  });
};

