/**
 * API Response wrapper format from backend
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Unwrap API response - extracts data from the wrapped response format
 * Handles both wrapped { success, data } and direct data responses
 */
export function unwrapResponse<T>(response: ApiResponse<T> | T): T {
  // Check if response is wrapped
  if (typeof response === 'object' && response !== null && 'success' in response && 'data' in response) {
    return (response as ApiResponse<T>).data;
  }
  // Return as-is if already unwrapped
  return response as T;
}

/**
 * Unwrap paginated API response
 * Handles both wrapped { success, data, pagination } and direct { data, pagination } responses
 */
export function unwrapPaginatedResponse<T>(response: ApiResponse<T[]> | { data: T[]; pagination?: any }): {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
} {
  // Check if response is wrapped with success field
  if (typeof response === 'object' && response !== null && 'success' in response) {
    const wrapped = response as ApiResponse<T[]>;
    return {
      data: wrapped.data,
      pagination: wrapped.pagination || {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      },
    };
  }
  
  // Handle direct paginated response
  const direct = response as { data: T[]; pagination?: any };
  return {
    data: direct.data || [],
    pagination: direct.pagination || {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    },
  };
}

