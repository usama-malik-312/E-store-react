export interface User {
  id: number | string;
  email: string;
  phone?: string;
  role?: string;
  full_name?: string;
  store_id?: number | null;
  username?: string; // For backward compatibility
  name?: string; // For backward compatibility
  permissions?: Array<{ code: string; name: string }> | string[]; // User permissions
}

export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  token: string; // Backend returns "token" not "accessToken"
  refreshToken: string;
  user: User;
  permissions?: string[]; // Array of permission codes
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
}

export interface AuthData {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface ApiError {
  message: string;
  status?: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  [key: string]: any; // For additional filters
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DropdownItem {
  id: number | string;
  name: string;
  code?: string;
}

