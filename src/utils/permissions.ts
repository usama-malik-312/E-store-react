import { tokenStorage } from './token';

/**
 * Get permissions from localStorage
 */
const getPermissions = (): string[] => {
  return tokenStorage.getPermissions();
};

/**
 * Check if user has a specific permission
 */
export const hasPermission = (code: string): boolean => {
  const perms = getPermissions();
  const user = tokenStorage.getUser();
  const userRole = user?.role || '';

  // Owner has all permissions
  if (userRole === 'owner') {
    return true;
  }

  // Check if user has the permission
  return perms.includes(code);
};

/**
 * Check if user can create items in a module
 */
export const canCreateBrands = () => hasPermission('brands.create');
export const canCreateUsers = () => hasPermission('users.create');
export const canCreateStores = () => hasPermission('stores.create');
export const canCreateRoles = () => hasPermission('roles.create');
export const canCreateInventory = () => hasPermission('inventory.create');
export const canCreateSuppliers = () => hasPermission('suppliers.create');
export const canCreateCustomers = () => hasPermission('customers.create');
export const canCreateItems = () => hasPermission('items.create');

/**
 * Check if user can read/view items in a module
 */
export const canReadUsers = () => hasPermission('users.read') || hasPermission('users.view');
export const canReadBrands = () => hasPermission('brands.read') || hasPermission('brands.view');
export const canReadStores = () => hasPermission('stores.read') || hasPermission('stores.view');
export const canReadRoles = () => hasPermission('roles.read') || hasPermission('roles.view');
export const canReadInventory = () => hasPermission('inventory.read') || hasPermission('inventory.view');
export const canReadSuppliers = () => hasPermission('suppliers.read') || hasPermission('suppliers.view');
export const canReadCustomers = () => hasPermission('customers.read') || hasPermission('customers.view');
export const canReadItems = () => hasPermission('items.read') || hasPermission('items.view');

/**
 * Check if user can update items in a module
 */
export const canUpdateUsers = () => hasPermission('users.update');
export const canUpdateBrands = () => hasPermission('brands.update');
export const canUpdateStores = () => hasPermission('stores.update');
export const canUpdateRoles = () => hasPermission('roles.update');
export const canUpdateInventory = () => hasPermission('inventory.update');
export const canUpdateSuppliers = () => hasPermission('suppliers.update');
export const canUpdateCustomers = () => hasPermission('customers.update');
export const canUpdateItems = () => hasPermission('items.update');

/**
 * Check if user can delete items in a module
 */
export const canDeleteUsers = () => hasPermission('users.delete');
export const canDeleteBrands = () => hasPermission('brands.delete');
export const canDeleteStores = () => hasPermission('stores.delete');
export const canDeleteRoles = () => hasPermission('roles.delete');
export const canDeleteInventory = () => hasPermission('inventory.delete');
export const canDeleteSuppliers = () => hasPermission('suppliers.delete');
export const canDeleteCustomers = () => hasPermission('customers.delete');
export const canDeleteItems = () => hasPermission('items.delete');

