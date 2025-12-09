import { useQuery } from '@tanstack/react-query';
import { suppliersApi } from '@/api/suppliers';
import { DropdownItem } from '@/types';

/**
 * Hook to fetch suppliers dropdown data
 * Returns id, name, and code for dropdowns
 */
export const useSuppliersDropdown = () => {
  return useQuery<DropdownItem[]>({
    queryKey: ['suppliers', 'dropdown'],
    queryFn: () => suppliersApi.getSuppliersDropdown(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

