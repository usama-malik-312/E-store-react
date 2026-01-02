import { axiosInstance } from "@/lib/axios";
import { ItemGroup, CreateItemGroupData, UpdateItemGroupData, ItemGroupsFilters } from "./types";
import { ApiResponse, unwrapResponse, unwrapPaginatedResponse } from "@/utils/apiResponse";
import { DropdownItem } from "@/types";

export const itemGroupsApi = {
  getItemGroups: async (
    filters: ItemGroupsFilters = {},
    page: number = 1,
    limit: number = 20
  ): Promise<{
    data: ItemGroup[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> => {
    const response = await axiosInstance.get<ApiResponse<ItemGroup[]>>("/item-groups", {
      params: {
        ...filters,
        page,
        limit,
        search: filters.search,
        sort: filters.sort || "group_name:ASC",
      },
    });
    return unwrapPaginatedResponse(response.data);
  },

  getItemGroupById: async (id: number | string): Promise<ItemGroup> => {
    const response = await axiosInstance.get<ApiResponse<ItemGroup>>(`/item-groups/${id}`);
    return unwrapResponse(response.data);
  },

  createItemGroup: async (data: CreateItemGroupData): Promise<ItemGroup> => {
    const response = await axiosInstance.post<ApiResponse<ItemGroup>>("/item-groups", data);
    return unwrapResponse(response.data);
  },

  updateItemGroup: async (id: number | string, data: UpdateItemGroupData): Promise<ItemGroup> => {
    const response = await axiosInstance.put<ApiResponse<ItemGroup>>(`/item-groups/${id}`, data);
    return unwrapResponse(response.data);
  },

  deleteItemGroup: async (id: number | string): Promise<void> => {
    await axiosInstance.delete(`/item-groups/${id}`);
  },

  getItemGroupsDropdown: async (): Promise<DropdownItem[]> => {
    const response = await axiosInstance.get<ApiResponse<DropdownItem[]>>("/item-groups/dropdown");
    return unwrapResponse(response.data);
  },
};


