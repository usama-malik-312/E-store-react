import { axiosInstance } from "@/lib/axios";
import {
  Sale,
  CreateSaleData,
  SalesFilters,
  SalesStatistics,
} from "./types";
import { ApiResponse, unwrapResponse, unwrapPaginatedResponse } from "@/utils/apiResponse";

export const posApi = {
  /**
   * Create a new sale
   */
  createSale: async (data: CreateSaleData): Promise<Sale> => {
    const response = await axiosInstance.post<ApiResponse<Sale>>("/pos/sales", data);
    return unwrapResponse(response.data);
  },

  /**
   * Get paginated list of sales
   */
  getSales: async (
    filters: SalesFilters = {},
    page: number = 1,
    limit: number = 20
  ): Promise<{
    data: Sale[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> => {
    const response = await axiosInstance.get<ApiResponse<Sale[]>>("/pos/sales", {
      params: {
        ...filters,
        page,
        limit,
        sort: filters.sort || "sale_date:DESC",
      },
    });
    return unwrapPaginatedResponse(response.data);
  },

  /**
   * Get sale by ID
   */
  getSaleById: async (id: number | string): Promise<Sale> => {
    const response = await axiosInstance.get<ApiResponse<Sale>>(`/pos/sales/${id}`);
    return unwrapResponse(response.data);
  },

  /**
   * Cancel a sale
   */
  cancelSale: async (id: number | string): Promise<Sale> => {
    const response = await axiosInstance.post<ApiResponse<Sale>>(`/pos/sales/${id}/cancel`);
    return unwrapResponse(response.data);
  },

  /**
   * Get sales statistics
   */
  getStatistics: async (filters: {
    store_id?: number;
    start_date?: string;
    end_date?: string;
  } = {}): Promise<SalesStatistics> => {
    const response = await axiosInstance.get<ApiResponse<SalesStatistics>>("/pos/statistics", {
      params: filters,
    });
    return unwrapResponse(response.data);
  },
};


