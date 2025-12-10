import { PaginationParams, PaginatedResponse } from '@/types';

export interface User {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  store_id?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  email: string;
  full_name: string;
  password: string;
  role: string;
  phone?: string;
  store_id?: number | null;
}

export interface UpdateUserData {
  email?: string;
  full_name?: string;
  password?: string;
  role?: string;
  phone?: string;
  status?: 'active' | 'inactive' | 'suspended';
  store_id?: number | null;
}

export interface UsersFilters extends PaginationParams {
  role?: string;
  status?: string;
  search?: string;
}

export type UsersResponse = PaginatedResponse<User>;

