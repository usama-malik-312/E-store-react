import { Input, Checkbox, Button, Divider } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Role, CreateRoleData, UpdateRoleData, PermissionGroup, Permission } from '../types';

interface RoleFormProps {
  role?: Role;
  permissions: Permission[];
  onSubmit: (data: CreateRoleData | UpdateRoleData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

const roleSchema = z.object({
  name: z.string().min(1, 'Role name is required'),
  code: z.string().min(1, 'Role code is required'),
  permissionIds: z.array(z.number()).min(1, 'At least one permission is required'),
});

type RoleFormData = z.infer<typeof roleSchema>;

// Group permissions by module
const groupPermissionsByModule = (permissions: Permission[]): PermissionGroup[] => {
  const grouped: Record<string, Permission[]> = {};
  
  permissions.forEach((perm) => {
    const module = perm.module || 'Other';
    if (!grouped[module]) {
      grouped[module] = [];
    }
    grouped[module].push(perm);
  });

  return Object.entries(grouped).map(([module, perms]) => ({
    module,
    permissions: perms,
  }));
};

export const RoleForm = ({
  role,
  permissions,
  onSubmit,
  onCancel,
  isLoading,
  isEdit,
}: RoleFormProps) => {
  const permissionGroups = groupPermissionsByModule(permissions);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: role?.name || '',
      code: role?.code || '',
      permissionIds: role?.permissions?.map((p) => p.id) || [],
    },
  });

  const onFormSubmit = (data: RoleFormData) => {
    onSubmit({
      name: data.name,
      code: data.code,
      permissionIds: data.permissionIds,
    });
  };

  const handleSelectAll = (modulePermissions: Permission[]) => {
    const allSelected = modulePermissions.every((p) => selectedPermissions.includes(p.id));
    const newSelection = allSelected
      ? selectedPermissions.filter((id) => !modulePermissions.some((p) => p.id === id))
      : [...new Set([...selectedPermissions, ...modulePermissions.map((p) => p.id)])];
    
    // This would need to be handled via setValue from react-hook-form
    // For now, we'll use a simpler approach
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Role Name *</label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                placeholder="Enter role name (e.g., Store Manager)"
                status={errors.name ? 'error' : ''}
              />
            )}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Role Code *</label>
          <Controller
            name="code"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                placeholder="Enter role code (e.g., store_manager)"
                status={errors.code ? 'error' : ''}
                disabled={isEdit} // Code usually can't be changed
              />
            )}
          />
          {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Permissions *</label>
          <Controller
            name="permissionIds"
            control={control}
            render={({ field }) => (
              <div className="border rounded-lg p-4 max-h-96 overflow-y-auto">
                {permissionGroups.map((group, groupIndex) => (
                  <div key={group.module} className={groupIndex > 0 ? 'mt-4' : ''}>
                    <div className="font-semibold text-gray-700 mb-2">{group.module}</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {group.permissions.map((permission) => (
                        <Checkbox
                          key={permission.id}
                          checked={field.value?.includes(permission.id)}
                          onChange={(e) => {
                            const current = field.value || [];
                            if (e.target.checked) {
                              field.onChange([...current, permission.id]);
                            } else {
                              field.onChange(current.filter((id) => id !== permission.id));
                            }
                          }}
                        >
                          {permission.name}
                          {permission.description && (
                            <span className="text-gray-500 text-xs ml-1">
                              ({permission.description})
                            </span>
                          )}
                        </Checkbox>
                      ))}
                    </div>
                    {groupIndex < permissionGroups.length - 1 && <Divider className="my-3" />}
                  </div>
                ))}
              </div>
            )}
          />
          {errors.permissionIds && (
            <p className="text-red-500 text-xs mt-1">{errors.permissionIds.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            {isEdit ? 'Update' : 'Create'} Role
          </Button>
        </div>
      </div>
    </form>
  );
};

