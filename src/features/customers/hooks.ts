import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customersApi } from "./api";
import { CreateCustomerData, UpdateCustomerData, CustomersFilters } from "./types";
import { message } from "antd";

export const useCustomers = (
  filters: CustomersFilters = {},
  page: number = 1,
  limit: number = 20
) => {
  return useQuery({
    queryKey: ["customers", filters, page, limit],
    queryFn: () => customersApi.getCustomers(filters, page, limit),
    placeholderData: (previousData) => previousData,
    staleTime: 2 * 60 * 1000,
  });
};

export const useCustomer = (id: number | string | null) => {
  return useQuery({
    queryKey: ["customers", id],
    queryFn: () => customersApi.getCustomerById(id!),
    enabled: !!id,
  });
};

export const useCustomersDropdown = () => {
  return useQuery({
    queryKey: ["customers", "dropdown"],
    queryFn: () => customersApi.getCustomersDropdown(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCustomerData) => customersApi.createCustomer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      message.success("Customer created successfully");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "Failed to create customer";
      message.error(errorMessage);
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: UpdateCustomerData }) =>
      customersApi.updateCustomer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      message.success("Customer updated successfully");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "Failed to update customer";
      message.error(errorMessage);
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => customersApi.deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      message.success("Customer deleted successfully");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "Failed to delete customer";
      message.error(errorMessage);
    },
  });
};

