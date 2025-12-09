import { useAuthContext } from '@/contexts/AuthContext';

/**
 * Hook to use authentication context
 * This is a wrapper around useAuthContext
 */
export const useAuth = () => {
  return useAuthContext();
};

