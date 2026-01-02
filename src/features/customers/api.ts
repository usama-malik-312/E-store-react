import { axiosInstance } from "@/lib/axios";
import { Customer, CreateCustomerData, UpdateCustomerData, CustomersFilters } from "./types";
import { ApiResponse, unwrapResponse, unwrapPaginatedResponse } from "@/utils/apiResponse";
import { DropdownItem } from "@/types";

export const customersApi = {
  getCustomers: async (
    filters: CustomersFilters = {},
    page: number = 1,
    limit: number = 20
  ): Promise<{
    data: Customer[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> => {
    const response = await axiosInstance.get<ApiResponse<Customer[]>>("/customers", {
      params: {
        ...filters,
        page,
        limit,
        search: filters.search,
        status: filters.status || "active",
        sort: filters.sort || "name:ASC",
      },
    });
    return unwrapPaginatedResponse(response.data);
  },

  getCustomerById: async (id: number | string): Promise<Customer> => {
    const response = await axiosInstance.get<ApiResponse<Customer>>(`/customers/${id}`);
    return unwrapResponse(response.data);
  },

  createCustomer: async (data: CreateCustomerData): Promise<Customer> => {
    const response = await axiosInstance.post<ApiResponse<Customer>>("/customers", data);
    return unwrapResponse(response.data);
  },

  updateCustomer: async (id: number | string, data: UpdateCustomerData): Promise<Customer> => {
    const response = await axiosInstance.put<ApiResponse<Customer>>(`/customers/${id}`, data);
    return unwrapResponse(response.data);
  },

  deleteCustomer: async (id: number | string): Promise<void> => {
    await axiosInstance.delete(`/customers/${id}`);
  },

  getCustomersDropdown: async (): Promise<DropdownItem[]> => {
    const response = await axiosInstance.get<ApiResponse<DropdownItem[]>>("/customers/dropdown");
    return unwrapResponse(response.data);
  },
};


