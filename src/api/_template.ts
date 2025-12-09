/**
 * API Hook Template
 * 
 * Copy this template to create new API hooks for your entities
 * 
 * Replace:
 * - EntityName with your entity name (e.g., Product, Category)
 * - entityName with lowercase (e.g., product, category)
 * - /entities with your API endpoint (e.g., /products, /categories)
 */

import { axiosInstance } from '@/lib/axios';
import { PaginationParams, PaginatedResponse, DropdownItem } from '@/types';

export interface EntityName {
  id: number;
  name: string;
  code?: string;
  // Add other fields as needed
  createdAt?: string;
  updatedAt?: string;
}

export const entityNameApi = {
  /**
   * Get entities with pagination, filters, and search
   * 
   * @param filters - Additional filters (e.g., { status: 'active', categoryId: 1 })
   * @param page - Page number (default: 1)
   * @param limit - Items per page (default: 20)
   * @returns Paginated response with data array and pagination info
   */
  getEntities: async (
    filters: PaginationParams = {},
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<EntityName>> => {
    const response = await axiosInstance.get<PaginatedResponse<EntityName>>('/entities', {
      params: {
        ...filters,
        page,
        limit,
      },
    });
    return response.data;
  },

  /**
   * Get entity by ID
   */
  getEntityById: async (id: number | string): Promise<EntityName> => {
    const response = await axiosInstance.get<EntityName>(`/entities/${id}`);
    return response.data;
  },

  /**
   * Create entity
   */
  createEntity: async (data: Partial<EntityName>): Promise<EntityName> => {
    const response = await axiosInstance.post<EntityName>('/entities', data);
    return response.data;
  },

  /**
   * Update entity
   */
  updateEntity: async (id: number | string, data: Partial<EntityName>): Promise<EntityName> => {
    const response = await axiosInstance.put<EntityName>(`/entities/${id}`, data);
    return response.data;
  },

  /**
   * Delete entity
   */
  deleteEntity: async (id: number | string): Promise<void> => {
    await axiosInstance.delete(`/entities/${id}`);
  },

  /**
   * Get entities dropdown (id, name, code)
   * 
   * Expected backend response format:
   * [
   *   { "id": 1, "name": "Entity 1", "code": "E1" },
   *   { "id": 2, "name": "Entity 2", "code": "E2" }
   * ]
   */
  getEntitiesDropdown: async (): Promise<DropdownItem[]> => {
    const response = await axiosInstance.get<DropdownItem[]>('/entities/dropdown');
    return response.data;
  },
};

