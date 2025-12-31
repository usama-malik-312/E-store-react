import { axiosInstance } from "@/lib/axios";
import { Supplier, CreateSupplierData, UpdateSupplierData, SuppliersFilters } from "./types";
import { ApiResponse, unwrapResponse, unwrapPaginatedResponse } from "@/utils/apiResponse";
import { DropdownItem } from "@/types";

export const suppliersApi = {
  getSuppliers: async (
    filters: SuppliersFilters = {},
    page: number = 1,
    limit: number = 20
  ): Promise<{
    data: Supplier[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> => {
    const response = await axiosInstance.get<ApiResponse<Supplier[]>>("/suppliers", {
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

  getSupplierById: async (id: number | string): Promise<Supplier> => {
    const response = await axiosInstance.get<ApiResponse<Supplier>>(`/suppliers/${id}`);
    return unwrapResponse(response.data);
  },

  createSupplier: async (data: CreateSupplierData): Promise<Supplier> => {
    const response = await axiosInstance.post<ApiResponse<Supplier>>("/suppliers", data);
    return unwrapResponse(response.data);
  },

  updateSupplier: async (id: number | string, data: UpdateSupplierData): Promise<Supplier> => {
    const response = await axiosInstance.put<ApiResponse<Supplier>>(`/suppliers/${id}`, data);
    return unwrapResponse(response.data);
  },

  deleteSupplier: async (id: number | string): Promise<void> => {
    await axiosInstance.delete(`/suppliers/${id}`);
  },

  getSuppliersDropdown: async (): Promise<DropdownItem[]> => {
    const response = await axiosInstance.get<ApiResponse<DropdownItem[]>>("/suppliers/dropdown");
    return unwrapResponse(response.data);
  },
};

