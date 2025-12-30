import { axiosInstance } from '@/lib/axios';
import { Role, Permission, CreateRoleData, UpdateRoleData } from './types';
import { ApiResponse, unwrapResponse, unwrapPaginatedResponse } from '@/utils/apiResponse';
import { PaginationParams } from '@/types';

export const rolesApi = {
  /**
   * Get all roles with pagination
   */
  getRoles: async (params: PaginationParams = {}): Promise<{
    data: Role[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> => {
    const response = await axiosInstance.get<ApiResponse<Role[]>>('/roles', {
      params: {
        page: params.page || 1,
        limit: params.limit || 10,
        search: params.search,
        sort: params.sort || 'name:ASC',
      },
    });
    return unwrapPaginatedResponse(response.data);
  },

  /**
   * Get role by ID
   */
  getRoleById: async (id: number): Promise<Role> => {
    const response = await axiosInstance.get<ApiResponse<Role>>(`/roles/${id}`);
    return unwrapResponse(response.data);
  },

  /**
   * Get role permissions
   */
  getRolePermissions: async (id: number): Promise<Permission[]> => {
    const response = await axiosInstance.get<ApiResponse<Permission[]>>(`/roles/${id}/permissions`);
    return unwrapResponse(response.data);
  },

  /**
   * Create role
   */
  createRole: async (data: CreateRoleData): Promise<Role> => {
    const response = await axiosInstance.post<ApiResponse<Role>>('/roles', data);
    return unwrapResponse(response.data);
  },

  /**
   * Update role
   */
  updateRole: async (id: number, data: UpdateRoleData): Promise<Role> => {
    const response = await axiosInstance.put<ApiResponse<Role>>(`/roles/${id}`, data);
    return unwrapResponse(response.data);
  },

  /**
   * Update role permissions
   */
  updateRolePermissions: async (id: number, permissionIds: number[]): Promise<Role> => {
    const response = await axiosInstance.post<ApiResponse<Role>>(`/roles/${id}/permissions`, {
      permissionIds,
    });
    return unwrapResponse(response.data);
  },

  /**
   * Delete role
   */
  deleteRole: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/roles/${id}`);
  },

  /**
   * Get all permissions
   */
  getPermissions: async (): Promise<Permission[]> => {
    const response = await axiosInstance.get<ApiResponse<Permission[]>>('/permissions');
    return unwrapResponse(response.data);
  },
};

