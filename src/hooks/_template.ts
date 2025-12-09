/**
 * React Query Hook Template
 * 
 * Copy this template to create new hooks for your entities
 * 
 * Replace:
 * - EntityName with your entity name (e.g., Product, Category)
 * - entityName with lowercase (e.g., product, category)
 * - entityNameApi with your API import (e.g., productsApi)
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { entityNameApi, EntityName } from '@/api/entityName';
import { PaginationParams } from '@/types';
import { message } from 'antd';

/**
 * Hook to fetch entities with pagination, filters, and search
 * 
 * @example
 * const { data, isLoading } = useEntities({ status: 'active' }, 1, 20);
 */
export const useEntities = (filters: PaginationParams = {}, page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ['entities', filters, page, limit],
    queryFn: () => entityNameApi.getEntities(filters, page, limit),
    keepPreviousData: true,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to fetch a single entity by ID
 * 
 * @example
 * const { data, isLoading } = useEntity(1);
 */
export const useEntity = (id: number | string | null) => {
  return useQuery({
    queryKey: ['entities', id],
    queryFn: () => entityNameApi.getEntityById(id!),
    enabled: !!id,
  });
};

/**
 * Hook to create an entity
 * 
 * @example
 * const createEntity = useCreateEntity();
 * createEntity.mutate({ name: 'New Entity', code: 'NE' });
 */
export const useCreateEntity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<EntityName>) => entityNameApi.createEntity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entities'] });
      message.success('Entity created successfully');
    },
    onError: () => {
      message.error('Failed to create entity');
    },
  });
};

/**
 * Hook to update an entity
 * 
 * @example
 * const updateEntity = useUpdateEntity();
 * updateEntity.mutate({ id: 1, data: { name: 'Updated Entity' } });
 */
export const useUpdateEntity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: Partial<EntityName> }) =>
      entityNameApi.updateEntity(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entities'] });
      message.success('Entity updated successfully');
    },
    onError: () => {
      message.error('Failed to update entity');
    },
  });
};

/**
 * Hook to delete an entity
 * 
 * @example
 * const deleteEntity = useDeleteEntity();
 * deleteEntity.mutate(1);
 */
export const useDeleteEntity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => entityNameApi.deleteEntity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entities'] });
      message.success('Entity deleted successfully');
    },
    onError: () => {
      message.error('Failed to delete entity');
    },
  });
};

/**
 * Hook to fetch entities dropdown
 * 
 * @example
 * const { data: dropdownItems } = useEntitiesDropdown();
 */
export const useEntitiesDropdown = () => {
  return useQuery({
    queryKey: ['entities', 'dropdown'],
    queryFn: () => entityNameApi.getEntitiesDropdown(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

