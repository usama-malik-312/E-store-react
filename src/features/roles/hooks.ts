import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rolesApi } from './api';
import { CreateRoleData, UpdateRoleData } from './types';
import { PaginationParams } from '@/types';
import { message } from 'antd';

/**
 * Hook to fetch all roles with pagination
 */
export const useRoles = (params: PaginationParams = {}, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['roles', params, page, limit],
    queryFn: () => rolesApi.getRoles({ ...params, page, limit }),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch a single role by ID
 */
export const useRole = (id: number | null) => {
  return useQuery({
    queryKey: ['roles', id],
    queryFn: () => rolesApi.getRoleById(id!),
    enabled: !!id,
  });
};

/**
 * Hook to fetch all permissions
 */
export const usePermissions = () => {
  return useQuery({
    queryKey: ['permissions'],
    queryFn: () => rolesApi.getPermissions(),
    staleTime: 10 * 60 * 1000, // 10 minutes - permissions rarely change
  });
};

/**
 * Hook to create a role
 */
export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoleData) => rolesApi.createRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      message.success('Role created successfully');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to create role';
      message.error(errorMessage);
    },
  });
};

/**
 * Hook to update a role
 */
export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateRoleData }) =>
      rolesApi.updateRole(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      message.success('Role updated successfully');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to update role';
      message.error(errorMessage);
    },
  });
};

/**
 * Hook to delete a role
 */
export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => rolesApi.deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      message.success('Role deleted successfully');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to delete role';
      message.error(errorMessage);
    },
  });
};

/**
 * Hook to update role permissions
 */
export const useUpdateRolePermissions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, permissionIds }: { id: number; permissionIds: number[] }) =>
      rolesApi.updateRolePermissions(id, permissionIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      message.success('Permissions updated successfully');
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to update permissions';
      message.error(errorMessage);
    },
  });
};

