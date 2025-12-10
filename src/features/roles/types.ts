export interface Permission {
  id: number;
  name: string;
  code: string;
  module: string;
  description?: string;
}

export interface Role {
  id: number;
  name: string;
  code: string;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleData {
  name: string;
  code: string;
  permissionIds: number[];
}

export interface UpdateRoleData {
  name?: string;
  code?: string;
  permissionIds?: number[];
}

export interface PermissionGroup {
  module: string;
  permissions: Permission[];
}

