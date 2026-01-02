import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { brandsApi } from "./api";
import { CreateBrandData, UpdateBrandData, BrandsFilters } from "./types";
import { message } from "antd";

/**
 * Hook to fetch brands with pagination, filters, and search
 */
export const useBrands = (
  filters: BrandsFilters = {},
  page: number = 1,
  limit: number = 20
) => {
  return useQuery({
    queryKey: ["brands", filters, page, limit],
    queryFn: () => brandsApi.getBrands(filters, page, limit),
    placeholderData: (previousData) => previousData,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to fetch a single brand by ID
 */
export const useBrand = (id: number | string | null) => {
  return useQuery({
    queryKey: ["brands", id],
    queryFn: () => brandsApi.getBrandById(id!),
    enabled: !!id,
  });
};

/**
 * Hook to fetch brands dropdown
 */
export const useBrandsDropdown = () => {
  return useQuery({
    queryKey: ["brands", "dropdown"],
    queryFn: () => brandsApi.getBrandsDropdown(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to create a brand
 */
export const useCreateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBrandData) => brandsApi.createBrand(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      message.success("Brand created successfully");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "Failed to create brand";
      message.error(errorMessage);
    },
  });
};

/**
 * Hook to update a brand
 */
export const useUpdateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: UpdateBrandData }) =>
      brandsApi.updateBrand(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      message.success("Brand updated successfully");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "Failed to update brand";
      message.error(errorMessage);
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
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      message.success("Brand deleted successfully");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "Failed to delete brand";
      message.error(errorMessage);
    },
  });
};


