import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { posApi } from "./api";
import { CreateSaleData, SalesFilters } from "./types";
import { message } from "antd";
import { handleApiError } from "@/utils/errorHandler";

/**
 * Hook to create a new sale
 */
export function useCreateSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSaleData) => posApi.createSale(data),
    onSuccess: (sale) => {
      message.success(`Sale ${sale.sale_number} completed successfully!`);
      // Invalidate sales queries to refresh lists
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["sales-statistics"] });
      return sale;
    },
    onError: handleApiError,
  });
}

/**
 * Hook to get paginated sales list
 */
export function useSales(filters: SalesFilters = {}, page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ["sales", filters, page, limit],
    queryFn: () => posApi.getSales(filters, page, limit),
  });
}

/**
 * Hook to get a single sale by ID
 */
export function useSale(id: number | string | null) {
  return useQuery({
    queryKey: ["sale", id],
    queryFn: () => posApi.getSaleById(id!),
    enabled: !!id,
  });
}

/**
 * Hook to cancel a sale
 */
export function useCancelSale() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => posApi.cancelSale(id),
    onSuccess: (sale) => {
      message.success(`Sale ${sale.sale_number} has been cancelled. Stock restored.`);
      // Invalidate sales queries
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["sale", sale.id] });
      queryClient.invalidateQueries({ queryKey: ["sales-statistics"] });
    },
    onError: handleApiError,
  });
}

/**
 * Hook to get sales statistics
 */
export function useSalesStatistics(filters: {
  store_id?: number;
  start_date?: string;
  end_date?: string;
} = {}) {
  return useQuery({
    queryKey: ["sales-statistics", filters],
    queryFn: () => posApi.getStatistics(filters),
  });
}


