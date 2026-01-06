import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { inventoryApi } from "./api";
import {
  CreateInventoryItemData,
  UpdateInventoryItemData,
  InventoryFilters,
} from "./types";
import { message } from "antd";

export const useInventoryItems = (
  filters: InventoryFilters = {},
  page: number = 1,
  limit: number = 20
) => {
  return useQuery({
    queryKey: ["inventory", filters, page, limit],
    queryFn: () => inventoryApi.getInventoryItems(filters, page, limit),
    placeholderData: (previousData) => previousData,
    staleTime: 2 * 60 * 1000,
  });
};

export const useInventoryItem = (id: number | string | null) => {
  return useQuery({
    queryKey: ["inventory", id],
    queryFn: () => inventoryApi.getInventoryItemById(id!),
    enabled: !!id,
  });
};

export const useInventoryItemsDropdown = (storeId?: number) => {
  return useQuery({
    queryKey: ["inventory", "dropdown", storeId],
    queryFn: () => inventoryApi.getInventoryItemsDropdown(storeId),
    staleTime: 5 * 60 * 1000,
  });
};

export const useLowStockItems = (storeId: number | null | undefined, threshold?: number) => {
  return useQuery({
    queryKey: ["inventory", "low-stock", storeId, threshold],
    queryFn: () => inventoryApi.getLowStockItems(storeId || undefined, threshold),
    staleTime: 2 * 60 * 1000,
  });
};

export const useCreateInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInventoryItemData) => inventoryApi.createInventoryItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      message.success("Inventory item created successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to create inventory item";
      message.error(errorMessage);
    },
  });
};

export const useUpdateInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number | string;
      data: UpdateInventoryItemData;
    }) => inventoryApi.updateInventoryItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      message.success("Inventory item updated successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to update inventory item";
      message.error(errorMessage);
    },
  });
};

export const useDeleteInventoryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => inventoryApi.deleteInventoryItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      message.success("Inventory item deleted successfully");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to delete inventory item";
      message.error(errorMessage);
    },
  });
};


