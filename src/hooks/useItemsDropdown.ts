import { useQuery } from '@tanstack/react-query';
import { itemsApi } from '@/api/items';
import { DropdownItem } from '@/types';

/**
 * Hook to fetch items dropdown data
 * Returns id, name, and code/itemCode for dropdowns
 */
export const useItemsDropdown = () => {
  return useQuery<DropdownItem[]>({
    queryKey: ['items', 'dropdown'],
    queryFn: () => itemsApi.getItemsDropdown(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

