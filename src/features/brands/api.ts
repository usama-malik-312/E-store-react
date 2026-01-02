import { axiosInstance } from "@/lib/axios";
import { Brand, CreateBrandData, UpdateBrandData, BrandsFilters } from "./types";
import { ApiResponse, unwrapResponse, unwrapPaginatedResponse } from "@/utils/apiResponse";
import { DropdownItem } from "@/types";

export const brandsApi = {
  /**
   * Get brands with pagination, filters, and search
   */
  getBrands: async (
    filters: BrandsFilters = {},
    page: number = 1,
    limit: number = 20
  ): Promise<{
    data: Brand[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> => {
    const response = await axiosInstance.get<ApiResponse<Brand[]>>("/brands", {
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

  /**
   * Get brand by ID
   */
  getBrandById: async (id: number | string): Promise<Brand> => {
    const response = await axiosInstance.get<ApiResponse<Brand>>(`/brands/${id}`);
    return unwrapResponse(response.data);
  },

  /**
   * Create brand
   */
  createBrand: async (data: CreateBrandData): Promise<Brand> => {
    const response = await axiosInstance.post<ApiResponse<Brand>>("/brands", data);
    return unwrapResponse(response.data);
  },

  /**
   * Update brand
   */
  updateBrand: async (id: number | string, data: UpdateBrandData): Promise<Brand> => {
    const response = await axiosInstance.put<ApiResponse<Brand>>(`/brands/${id}`, data);
    return unwrapResponse(response.data);
  },

  /**
   * Delete brand
   */
  deleteBrand: async (id: number | string): Promise<void> => {
    await axiosInstance.delete(`/brands/${id}`);
  },

  /**
   * Get brands dropdown
   */
  getBrandsDropdown: async (): Promise<DropdownItem[]> => {
    const response = await axiosInstance.get<ApiResponse<DropdownItem[]>>("/brands/dropdown");
    return unwrapResponse(response.data);
  },
};


