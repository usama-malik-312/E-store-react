import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { suppliersApi } from "./api";
import { CreateSupplierData, UpdateSupplierData, SuppliersFilters } from "./types";
import { message } from "antd";

export const useSuppliers = (
  filters: SuppliersFilters = {},
  page: number = 1,
  limit: number = 20
) => {
  return useQuery({
    queryKey: ["suppliers", filters, page, limit],
    queryFn: () => suppliersApi.getSuppliers(filters, page, limit),
    placeholderData: (previousData) => previousData,
    staleTime: 2 * 60 * 1000,
  });
};

export const useSupplier = (id: number | string | null) => {
  return useQuery({
    queryKey: ["suppliers", id],
    queryFn: () => suppliersApi.getSupplierById(id!),
    enabled: !!id,
  });
};

export const useSuppliersDropdown = () => {
  return useQuery({
    queryKey: ["suppliers", "dropdown"],
    queryFn: () => suppliersApi.getSuppliersDropdown(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSupplierData) => suppliersApi.createSupplier(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      message.success("Supplier created successfully");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "Failed to create supplier";
      message.error(errorMessage);
    },
  });
};

export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: UpdateSupplierData }) =>
      suppliersApi.updateSupplier(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      message.success("Supplier updated successfully");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "Failed to update supplier";
      message.error(errorMessage);
    },
  });
};

export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => suppliersApi.deleteSupplier(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      message.success("Supplier deleted successfully");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "Failed to delete supplier";
      message.error(errorMessage);
    },
  });
};

