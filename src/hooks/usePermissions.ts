import { useAuthContext } from '@/contexts/AuthContext';
import { usePermissions as usePermissionsList } from '@/features/roles/hooks';

/**
 * Hook to check user permissions
 * Returns helper functions to check if user has specific permissions
 */
export const usePermissions = () => {
  const { user, permissions: userPermissions } = useAuthContext();
  const { data: permissionsList } = usePermissionsList();

  // Get user's role
  const userRole = user?.role || '';

  /**
   * Check if user has a specific permission
   */
  const hasPermission = (permissionCode: string): boolean => {
    // Owner has all permissions
    if (userRole === 'owner') {
      return true;
    }

    // Check if user has the permission
    return userPermissions.some(
      (perm: any) => perm.code === permissionCode || perm === permissionCode
    );
  };

  /**
   * Check if user has any of the given permissions
   */
  const hasAnyPermission = (permissionCodes: string[]): boolean => {
    if (userRole === 'owner') {
      return true;
    }
    return permissionCodes.some((code) => hasPermission(code));
  };

  /**
   * Check if user has all of the given permissions
   */
  const hasAllPermissions = (permissionCodes: string[]): boolean => {
    if (userRole === 'owner') {
      return true;
    }
    return permissionCodes.every((code) => hasPermission(code));
  };

  /**
   * Check if user can perform CRUD operations on a module
   */
  const canCreate = (module: string): boolean => {
    return hasPermission(`${module}.create`);
  };

  const canUpdate = (module: string): boolean => {
    return hasPermission(`${module}.update`);
  };

  const canDelete = (module: string): boolean => {
    return hasPermission(`${module}.delete`);
  };

  const canView = (module: string): boolean => {
    return hasPermission(`${module}.view`) || hasPermission(`${module}.read`);
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canCreate,
    canUpdate,
    canDelete,
    canView,
    userRole,
    permissions: userPermissions,
    permissionsList: permissionsList || [],
  };
};

