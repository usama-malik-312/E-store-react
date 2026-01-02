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
    const response = await axiosInstance.get<ApiResponse<any[]>>("/inventory", {
      params: {
        ...filters,
        page,
        limit,
        search: filters.search,
        sort: filters.sort || "item_name:ASC",
      },
    });
    const result = unwrapPaginatedResponse(response.data);
    // Transform price to selling_price if backend returns 'price'
    const transformedData = result.data.map((item: any) => {
      const sellingPrice = item.selling_price ?? item.price;
      return {
        ...item,
        selling_price: sellingPrice ? Number(sellingPrice) : 0,
      };
    });
    return {
      ...result,
      data: transformedData,
    };
  },

  getInventoryItemById: async (id: number | string): Promise<InventoryItem> => {
    const response = await axiosInstance.get<ApiResponse<any>>(`/inventory/${id}`);
    const data = unwrapResponse(response.data);
    // Transform price to selling_price if backend returns 'price'
    const sellingPrice = data.selling_price ?? data.price;
    return {
      ...data,
      selling_price: sellingPrice ? Number(sellingPrice) : 0,
    };
  },

  createInventoryItem: async (data: CreateInventoryItemData): Promise<InventoryItem> => {
    // Transform selling_price to price for backend API
    const { selling_price, ...rest } = data;
    const payload = {
      ...rest,
      price: selling_price,
    };
    const response = await axiosInstance.post<ApiResponse<any>>("/inventory", payload);
    const result = unwrapResponse(response.data);
    // Transform price to selling_price if backend returns 'price'
    const sellingPrice = result.selling_price ?? result.price;
    return {
      ...result,
      selling_price: sellingPrice ? Number(sellingPrice) : 0,
    };
  },

  updateInventoryItem: async (
    id: number | string,
    data: UpdateInventoryItemData
  ): Promise<InventoryItem> => {
    // Transform selling_price to price for backend API if present
    const payload = data.selling_price !== undefined
      ? (() => {
          const { selling_price, ...rest } = data;
          return { ...rest, price: selling_price };
        })()
      : data;
    const response = await axiosInstance.put<ApiResponse<any>>(
      `/inventory/${id}`,
      payload
    );
    const result = unwrapResponse(response.data);
    // Transform price to selling_price if backend returns 'price'
    const sellingPrice = result.selling_price ?? result.price;
    return {
      ...result,
      selling_price: sellingPrice ? Number(sellingPrice) : 0,
    };
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
    const response = await axiosInstance.get<ApiResponse<any[]>>(
      "/inventory/low-stock",
      {
        params: {
          store_id: storeId,
          threshold,
        },
      }
    );
    const result = unwrapPaginatedResponse(response.data);
    // Transform price to selling_price if backend returns 'price'
    const transformedData = result.data.map((item: any) => {
      const sellingPrice = item.selling_price ?? item.price;
      return {
        ...item,
        selling_price: sellingPrice ? Number(sellingPrice) : 0,
      };
    });
    return {
      ...result,
      data: transformedData,
    };
  },
};


