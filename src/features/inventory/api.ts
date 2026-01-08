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
    const params: any = {
      page,
      limit,
    };
    
    // Only include filters if they have values
    if (filters.search) {
      params.search = filters.search;
    }
    if (filters.store_id) {
      params.store_id = filters.store_id;
    }
    // Handle item_group_id filter
    // If item_group_id is explicitly set, include it
    // -1 means ungrouped items (item_group_id IS NULL)
    // Other numbers mean specific group ID
    if (filters.item_group_id !== undefined && filters.item_group_id !== null) {
      if (filters.item_group_id === -1) {
        // For ungrouped items, send null to backend
        // Backend should filter for items where item_group_id IS NULL
        params.item_group_id = null;
      } else {
        params.item_group_id = filters.item_group_id;
      }
    }
    if (filters.status) {
      params.status = filters.status;
    }
    if (filters.brand_id) {
      params.brand_id = filters.brand_id;
    }
    if (filters.supplier_id) {
      params.supplier_id = filters.supplier_id;
    }
    if (filters.sort) {
      params.sort = filters.sort;
    } else {
      params.sort = "item_name ASC";
    }
    
    const response = await axiosInstance.get<ApiResponse<any[]>>("/inventory", {
      params,
    });
    const result = unwrapPaginatedResponse(response.data);
    // Transform price to selling_price if backend returns 'price'
    // Also normalize store_name, group_name, brand_name, supplier_name from nested objects if needed
    const transformedData = result.data.map((item: any) => {
      const sellingPrice = item.selling_price ?? item.price;
      return {
        ...item,
        selling_price: sellingPrice ? Number(sellingPrice) : 0,
        // Normalize store fields
        store_name: item.store_name || item.store?.name,
        store_location: item.store_location || item.store?.location,
        // Normalize group fields
        group_name: item.group_name || item.item_group?.group_name,
        // Normalize brand fields
        brand_name: item.brand_name || item.brand?.name,
        // Normalize supplier fields
        supplier_name: item.supplier_name || item.supplier?.name,
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
    // Also normalize store_name, group_name, brand_name, supplier_name from nested objects if needed
    const sellingPrice = data.selling_price ?? data.price;
    return {
      ...data,
      selling_price: sellingPrice ? Number(sellingPrice) : 0,
      // Normalize store fields
      store_name: data.store_name || data.store?.name,
      store_location: data.store_location || data.store?.location,
      // Normalize group fields
      group_name: data.group_name || data.item_group?.group_name,
      // Normalize brand fields
      brand_name: data.brand_name || data.brand?.name,
      // Normalize supplier fields
      supplier_name: data.supplier_name || data.supplier?.name,
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
    storeId?: number,
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
    const params: any = {};
    if (storeId) {
      params.store_id = storeId;
    }
    if (threshold) {
      params.threshold = threshold;
    }
    const response = await axiosInstance.get<ApiResponse<any[]>>(
      "/inventory/low-stock",
      {
        params,
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


