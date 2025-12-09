import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { brandsApi, Brand } from '@/api/brands';
import { PaginationParams } from '@/types';
import { message } from 'antd';

/**
 * Hook to fetch brands with pagination, filters, and search
 */
export const useBrands = (filters: PaginationParams = {}, page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ['brands', filters, page, limit],
    queryFn: () => brandsApi.getBrands(filters, page, limit),
    keepPreviousData: true,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to fetch a single brand by ID
 */
export const useBrand = (id: number | string | null) => {
  return useQuery({
    queryKey: ['brands', id],
    queryFn: () => brandsApi.getBrandById(id!),
    enabled: !!id,
  });
};

/**
 * Hook to create a brand
 */
export const useCreateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Brand>) => brandsApi.createBrand(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      message.success('Brand created successfully');
    },
    onError: () => {
      message.error('Failed to create brand');
    },
  });
};

/**
 * Hook to update a brand
 */
export const useUpdateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: Partial<Brand> }) =>
      brandsApi.updateBrand(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      message.success('Brand updated successfully');
    },
    onError: () => {
      message.error('Failed to update brand');
    },
  });
};

/**
 * Hook to delete a brand
 */
export const useDeleteBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => brandsApi.deleteBrand(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      message.success('Brand deleted successfully');
    },
    onError: () => {
      message.error('Failed to delete brand');
    },
  });
};

