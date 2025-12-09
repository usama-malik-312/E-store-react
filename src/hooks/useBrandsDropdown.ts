import { useQuery } from '@tanstack/react-query';
import { brandsApi } from '@/api/brands';
import { DropdownItem } from '@/types';

/**
 * Hook to fetch brands dropdown data
 * Returns id, name, and code for dropdowns
 */
export const useBrandsDropdown = () => {
  return useQuery<DropdownItem[]>({
    queryKey: ['brands', 'dropdown'],
    queryFn: () => brandsApi.getBrandsDropdown(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

