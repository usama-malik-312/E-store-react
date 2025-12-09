import { axiosInstance } from '@/lib/axios';
import { PaginationParams, PaginatedResponse, DropdownItem } from '@/types';

export interface Item {
  id: number;
  name: string;
  code?: string;
  itemCode?: string;
  description?: string;
  price?: number;
  stock?: number;
  brandId?: number;
  supplierId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export const itemsApi = {
  /**
   * Get items with pagination, filters, and search
   */
  getItems: async (
    filters: PaginationParams = {},
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Item>> => {
    const response = await axiosInstance.get<PaginatedResponse<Item>>('/items', {
      params: {
        ...filters,
        page,
        limit,
      },
    });
    return response.data;
  },

  /**
   * Get item by ID
   */
  getItemById: async (id: number | string): Promise<Item> => {
    const response = await axiosInstance.get<Item>(`/items/${id}`);
    return response.data;
  },

  /**
   * Create item
   */
  createItem: async (data: Partial<Item>): Promise<Item> => {
    const response = await axiosInstance.post<Item>('/items', data);
    return response.data;
  },

  /**
   * Update item
   */
  updateItem: async (id: number | string, data: Partial<Item>): Promise<Item> => {
    const response = await axiosInstance.put<Item>(`/items/${id}`, data);
    return response.data;
  },

  /**
   * Delete item
   */
  deleteItem: async (id: number | string): Promise<void> => {
    await axiosInstance.delete(`/items/${id}`);
  },

  /**
   * Get items dropdown (id, name, code/itemCode)
   */
  getItemsDropdown: async (): Promise<DropdownItem[]> => {
    const response = await axiosInstance.get<DropdownItem[]>('/items/dropdown');
    return response.data;
  },
};

