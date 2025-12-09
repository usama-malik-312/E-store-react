import { axiosInstance } from '@/lib/axios';
import { PaginationParams, PaginatedResponse, DropdownItem } from '@/types';

export interface Brand {
  id: number;
  name: string;
  code?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const brandsApi = {
  /**
   * Get brands with pagination, filters, and search
   */
  getBrands: async (
    filters: PaginationParams = {},
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Brand>> => {
    const response = await axiosInstance.get<PaginatedResponse<Brand>>('/brands', {
      params: {
        ...filters,
        page,
        limit,
      },
    });
    return response.data;
  },

  /**
   * Get brand by ID
   */
  getBrandById: async (id: number | string): Promise<Brand> => {
    const response = await axiosInstance.get<Brand>(`/brands/${id}`);
    return response.data;
  },

  /**
   * Create brand
   */
  createBrand: async (data: Partial<Brand>): Promise<Brand> => {
    const response = await axiosInstance.post<Brand>('/brands', data);
    return response.data;
  },

  /**
   * Update brand
   */
  updateBrand: async (id: number | string, data: Partial<Brand>): Promise<Brand> => {
    const response = await axiosInstance.put<Brand>(`/brands/${id}`, data);
    return response.data;
  },

  /**
   * Delete brand
   */
  deleteBrand: async (id: number | string): Promise<void> => {
    await axiosInstance.delete(`/brands/${id}`);
  },

  /**
   * Get brands dropdown (id, name, code)
   */
  getBrandsDropdown: async (): Promise<DropdownItem[]> => {
    const response = await axiosInstance.get<DropdownItem[]>('/brands/dropdown');
    return response.data;
  },
};

