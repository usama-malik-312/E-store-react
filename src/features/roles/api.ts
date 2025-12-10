import { axiosInstance } from '@/lib/axios';
import { Role, Permission, CreateRoleData, UpdateRoleData } from './types';

export const rolesApi = {
  /**
   * Get all roles
   */
  getRoles: async (): Promise<Role[]> => {
    const response = await axiosInstance.get<Role[]>('/roles');
    return response.data;
  },

  /**
   * Get role by ID
   */
  getRoleById: async (id: number): Promise<Role> => {
    const response = await axiosInstance.get<Role>(`/roles/${id}`);
    return response.data;
  },

  /**
   * Create role
   */
  createRole: async (data: CreateRoleData): Promise<Role> => {
    const response = await axiosInstance.post<Role>('/roles', data);
    return response.data;
  },

  /**
   * Update role
   */
  updateRole: async (id: number, data: UpdateRoleData): Promise<Role> => {
    const response = await axiosInstance.put<Role>(`/roles/${id}`, data);
    return response.data;
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
    const response = await axiosInstance.get<Permission[]>('/permissions');
    return response.data;
  },
};

