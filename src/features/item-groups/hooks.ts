import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { itemGroupsApi } from "./api";
import { CreateItemGroupData, UpdateItemGroupData, ItemGroupsFilters } from "./types";
import { message } from "antd";

export const useItemGroups = (
  filters: ItemGroupsFilters = {},
  page: number = 1,
  limit: number = 20
) => {
  return useQuery({
    queryKey: ["item-groups", filters, page, limit],
    queryFn: () => itemGroupsApi.getItemGroups(filters, page, limit),
    placeholderData: (previousData) => previousData,
    staleTime: 2 * 60 * 1000,
  });
};

export const useItemGroup = (id: number | string | null) => {
  return useQuery({
    queryKey: ["item-groups", id],
    queryFn: () => itemGroupsApi.getItemGroupById(id!),
    enabled: !!id,
  });
};

export const useItemGroupsDropdown = () => {
  return useQuery({
    queryKey: ["item-groups", "dropdown"],
    queryFn: () => itemGroupsApi.getItemGroupsDropdown(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateItemGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateItemGroupData) => itemGroupsApi.createItemGroup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["item-groups"] });
      message.success("Item group created successfully");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "Failed to create item group";
      message.error(errorMessage);
    },
  });
};

export const useUpdateItemGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: UpdateItemGroupData }) =>
      itemGroupsApi.updateItemGroup(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["item-groups"] });
      message.success("Item group updated successfully");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "Failed to update item group";
      message.error(errorMessage);
    },
  });
};

export const useDeleteItemGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => itemGroupsApi.deleteItemGroup(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["item-groups"] });
      message.success("Item group deleted successfully");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "Failed to delete item group";
      message.error(errorMessage);
    },
  });
};

