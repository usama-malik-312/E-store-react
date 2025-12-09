import { axiosInstance } from '@/lib/axios';
import { PaginationParams, PaginatedResponse, DropdownItem } from '@/types';

export interface Supplier {
  id: number;
  name: string;
  code?: string;
  email?: string;
  phone?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const suppliersApi = {
  /**
   * Get suppliers with pagination, filters, and search
   */
  getSuppliers: async (
    filters: PaginationParams = {},
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Supplier>> => {
    const response = await axiosInstance.get<PaginatedResponse<Supplier>>('/suppliers', {
      params: {
        ...filters,
        page,
        limit,
      },
    });
    return response.data;
  },

  /**
   * Get supplier by ID
   */
  getSupplierById: async (id: number | string): Promise<Supplier> => {
    const response = await axiosInstance.get<Supplier>(`/suppliers/${id}`);
    return response.data;
  },

  /**
   * Create supplier
   */
  createSupplier: async (data: Partial<Supplier>): Promise<Supplier> => {
    const response = await axiosInstance.post<Supplier>('/suppliers', data);
    return response.data;
  },

  /**
   * Update supplier
   */
  updateSupplier: async (id: number | string, data: Partial<Supplier>): Promise<Supplier> => {
    const response = await axiosInstance.put<Supplier>(`/suppliers/${id}`, data);
    return response.data;
  },

  /**
   * Delete supplier
   */
  deleteSupplier: async (id: number | string): Promise<void> => {
    await axiosInstance.delete(`/suppliers/${id}`);
  },

  /**
   * Get suppliers dropdown (id, name, code)
   */
  getSuppliersDropdown: async (): Promise<DropdownItem[]> => {
    const response = await axiosInstance.get<DropdownItem[]>('/suppliers/dropdown');
    return response.data;
  },
};

