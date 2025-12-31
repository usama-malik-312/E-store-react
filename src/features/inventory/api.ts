import { axiosInstance } from "@/lib/axios";
import {
  InventoryItem,
  CreateInventoryItemData,
  UpdateInventoryItemData,
  InventoryFilters,
  LowStockItem,
} from "./types";
import { ApiResponse, unwrapResponse, unwrapPaginatedResponse } from "@/utils/apiResponse";
import { DropdownItem } from "@/types";

export const inventoryApi = {
  getInventoryItems: async (
    filters: InventoryFilters = {},
    page: number = 1,
    limit: number = 20
  ): Promise<{
    data: InventoryItem[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> => {
    const response = await axiosInstance.get<ApiResponse<InventoryItem[]>>("/inventory", {
      params: {
        ...filters,
        page,
        limit,
        search: filters.search,
        sort: filters.sort || "item_name:ASC",
      },
    });
    return unwrapPaginatedResponse(response.data);
  },

  getInventoryItemById: async (id: number | string): Promise<InventoryItem> => {
    const response = await axiosInstance.get<ApiResponse<InventoryItem>>(`/inventory/${id}`);
    return unwrapResponse(response.data);
  },

  createInventoryItem: async (data: CreateInventoryItemData): Promise<InventoryItem> => {
    const response = await axiosInstance.post<ApiResponse<InventoryItem>>("/inventory", data);
    return unwrapResponse(response.data);
  },

  updateInventoryItem: async (
    id: number | string,
    data: UpdateInventoryItemData
  ): Promise<InventoryItem> => {
    const response = await axiosInstance.put<ApiResponse<InventoryItem>>(
      `/inventory/${id}`,
      data
    );
    return unwrapResponse(response.data);
  },

  deleteInventoryItem: async (id: number | string): Promise<void> => {
    await axiosInstance.delete(`/inventory/${id}`);
  },

  getInventoryItemsDropdown: async (storeId?: number): Promise<DropdownItem[]> => {
    const response = await axiosInstance.get<ApiResponse<DropdownItem[]>>(
      "/inventory/dropdown",
      {
        params: storeId ? { store_id: storeId } : {},
      }
    );
    return unwrapResponse(response.data);
  },

  getLowStockItems: async (
    storeId: number,
    threshold?: number
  ): Promise<{
    data: LowStockItem[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> => {
    const response = await axiosInstance.get<ApiResponse<LowStockItem[]>>(
      "/inventory/low-stock",
      {
        params: {
          store_id: storeId,
          threshold,
        },
      }
    );
    return unwrapPaginatedResponse(response.data);
  },
};

