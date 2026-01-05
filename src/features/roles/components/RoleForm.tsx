import { Input, Checkbox, Button, Divider } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Role, CreateRoleData, UpdateRoleData, PermissionGroup, Permission } from '../types';
import { useTranslation } from 'react-i18next';

interface RoleFormProps {
  role?: Role;
  permissions: Permission[];
  onSubmit: (data: CreateRoleData | UpdateRoleData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

const getRoleSchema = (t: (key: string) => string) => z.object({
  name: z.string().min(1, t('roles.roleNameRequired')),
  code: z.string().min(1, t('roles.roleNameRequired')),
  description: z.string().optional(),
  permissionIds: z.array(z.number()).optional(),
});

type RoleFormData = z.infer<ReturnType<typeof getRoleSchema>>;

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
  const { t } = useTranslation();
  const permissionGroups = groupPermissionsByModule(permissions);
  const roleSchema = getRoleSchema(t);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: role?.name || '',
      code: role?.code || '',
      description: role?.description || '',
      permissionIds: role?.permissions?.map((p) => p.id) || [],
    },
  });

  const onFormSubmit = (data: RoleFormData) => {
    onSubmit({
      name: data.name,
      code: data.code,
      description: data.description,
      permissionIds: data.permissionIds || [],
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            {t('roles.roleName')} *
          </label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                placeholder={t('roles.enterRoleName')}
                status={errors.name ? 'error' : ''}
              />
            )}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {t('roles.roleCode')} *
          </label>
          <Controller
            name="code"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                placeholder={t('roles.enterRoleCode')}
                status={errors.code ? 'error' : ''}
                disabled={isEdit}
              />
            )}
          />
          {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {t('common.description')}
          </label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Input.TextArea
                {...field}
                size="large"
                placeholder={t('roles.enterDescription')}
                rows={3}
                status={errors.description ? 'error' : ''}
              />
            )}
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
          )}
        </div>

        {isEdit && (
          <div className="text-sm text-blue-600 dark:text-blue-400 mb-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
            💡 {t('roles.editPermissions')}
          </div>
        )}

        {!isEdit && (
          <div>
            <label className="block text-sm font-medium mb-2">
              {t('roles.permissions')}
            </label>
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
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button onClick={onCancel} disabled={isLoading}>
            {t('common.cancel')}
          </Button>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            {isEdit ? t('common.update') : t('common.create')} {t('roles.title').split(' ')[0]}
          </Button>
        </div>
      </div>
    </form>
  );
};
