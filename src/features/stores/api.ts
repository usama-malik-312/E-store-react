import { axiosInstance } from "@/lib/axios";
import { Store, CreateStoreData, UpdateStoreData, StoresFilters } from "./types";
import { ApiResponse, unwrapResponse, unwrapPaginatedResponse } from "@/utils/apiResponse";
import { DropdownItem } from "@/types";

export const storesApi = {
  getStores: async (
    filters: StoresFilters = {},
    page: number = 1,
    limit: number = 20
  ): Promise<{
    data: Store[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> => {
    const response = await axiosInstance.get<ApiResponse<Store[]>>("/stores", {
      params: {
        ...filters,
        page,
        limit,
        search: filters.search,
        sort: filters.sort || "name:ASC",
      },
    });
    return unwrapPaginatedResponse(response.data);
  },

  getStoreById: async (id: number | string): Promise<Store> => {
    const response = await axiosInstance.get<ApiResponse<Store>>(`/stores/${id}`);
    return unwrapResponse(response.data);
  },

  createStore: async (data: CreateStoreData): Promise<Store> => {
    const response = await axiosInstance.post<ApiResponse<Store>>("/stores", data);
    return unwrapResponse(response.data);
  },

  updateStore: async (id: number | string, data: UpdateStoreData): Promise<Store> => {
    const response = await axiosInstance.put<ApiResponse<Store>>(`/stores/${id}`, data);
    return unwrapResponse(response.data);
  },

  deleteStore: async (id: number | string): Promise<void> => {
    await axiosInstance.delete(`/stores/${id}`);
  },

  getStoresDropdown: async (): Promise<DropdownItem[]> => {
    const response = await axiosInstance.get<ApiResponse<DropdownItem[]>>("/stores/dropdown");
    return unwrapResponse(response.data);
  },
};


