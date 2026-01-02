import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { storesApi } from "./api";
import { CreateStoreData, UpdateStoreData, StoresFilters } from "./types";
import { message } from "antd";

export const useStores = (
  filters: StoresFilters = {},
  page: number = 1,
  limit: number = 20
) => {
  return useQuery({
    queryKey: ["stores", filters, page, limit],
    queryFn: () => storesApi.getStores(filters, page, limit),
    placeholderData: (previousData) => previousData,
    staleTime: 2 * 60 * 1000,
  });
};

export const useStore = (id: number | string | null) => {
  return useQuery({
    queryKey: ["stores", id],
    queryFn: () => storesApi.getStoreById(id!),
    enabled: !!id,
  });
};

export const useStoresDropdown = () => {
  return useQuery({
    queryKey: ["stores", "dropdown"],
    queryFn: () => storesApi.getStoresDropdown(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateStore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStoreData) => storesApi.createStore(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
      message.success("Store created successfully");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "Failed to create store";
      message.error(errorMessage);
    },
  });
};

export const useUpdateStore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: UpdateStoreData }) =>
      storesApi.updateStore(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
      message.success("Store updated successfully");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "Failed to update store";
      message.error(errorMessage);
    },
  });
};

export const useDeleteStore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => storesApi.deleteStore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
      message.success("Store deleted successfully");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "Failed to delete store";
      message.error(errorMessage);
    },
  });
};


