import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Checkbox, Typography, Divider, Spin } from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useRole, usePermissions, useUpdateRolePermissions } from "../hooks";
import { Permission } from "../types";

const { Title } = Typography;

// Group permissions by module
const groupPermissionsByModule = (permissions: Permission[]) => {
  const grouped: Record<string, Permission[]> = {};

  permissions.forEach((perm) => {
    const module = perm.module || "Other";
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

// CRUD actions for each module
const CRUD_ACTIONS = [
  { code: "create", label: "Create" },
  { code: "read", label: "Read" },
  { code: "update", label: "Update" },
  { code: "delete", label: "Delete" },
];

export const RolePermissions = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const roleId = id ? parseInt(id) : null;

  const { data: role, isLoading: roleLoading } = useRole(roleId);
  const { data: allPermissions, isLoading: permissionsLoading } =
    usePermissions();
  const updatePermissionsMutation = useUpdateRolePermissions();

  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>(
    []
  );

  useEffect(() => {
    if (role?.permissions) {
      setSelectedPermissionIds(role.permissions.map((p) => p.id));
    }
  }, [role]);

  const isLoading = roleLoading || permissionsLoading;

  const handleTogglePermission = (permissionId: number) => {
    setSelectedPermissionIds((prev) => {
      if (prev.includes(permissionId)) {
        return prev.filter((id) => id !== permissionId);
      } else {
        return [...prev, permissionId];
      }
    });
  };

  const handleSelectAllModule = (modulePermissions: Permission[]) => {
    const allSelected = modulePermissions.every((p) =>
      selectedPermissionIds.includes(p.id)
    );
    if (allSelected) {
      // Deselect all in module
      setSelectedPermissionIds((prev) =>
        prev.filter((id) => !modulePermissions.some((p) => p.id === id))
      );
    } else {
      // Select all in module
      const moduleIds = modulePermissions.map((p) => p.id);
      setSelectedPermissionIds((prev) => [...new Set([...prev, ...moduleIds])]);
    }
  };

  const handleSave = () => {
    if (!roleId) return;

    updatePermissionsMutation.mutate(
      {
        id: roleId,
        permissionIds: selectedPermissionIds,
      },
      {
        onSuccess: () => {
          navigate("/roles");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!role) {
    return (
      <div>
        <Title level={2}>Role not found</Title>
      </div>
    );
  }

  const permissionGroups = groupPermissionsByModule(allPermissions || []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/roles")}
          >
            Back
          </Button>
          <Title level={2} className="mb-0">
            Edit Permissions: {role.name}
          </Title>
        </div>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={handleSave}
          loading={updatePermissionsMutation.isPending}
          size="large"
        >
          Save Permissions
        </Button>
      </div>

      <Card>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {permissionGroups.map((group, groupIndex) => {
            const modulePermissions = group.permissions;
            const allModuleSelected = modulePermissions.every((p) =>
              selectedPermissionIds.includes(p.id)
            );
            const someModuleSelected = modulePermissions.some((p) =>
              selectedPermissionIds.includes(p.id)
            );

            return (
              <div key={group.module} className={groupIndex > 0 ? "mt-6" : ""}>
                <div className="flex items-center justify-between mb-4">
                  <Title level={4} className="mb-0">
                    {group.module}
                  </Title>
                  <Checkbox
                    checked={allModuleSelected}
                    indeterminate={someModuleSelected && !allModuleSelected}
                    onChange={() => handleSelectAllModule(modulePermissions)}
                  >
                    Select All
                  </Checkbox>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {CRUD_ACTIONS.map((action) => {
                    const permission = modulePermissions.find(
                      (p) =>
                        p.code ===
                        `${group.module.toLowerCase()}.${action.code}`
                    );

                    if (!permission) return null;

                    const isChecked = selectedPermissionIds.includes(
                      permission.id
                    );

                    return (
                      <div
                        key={permission.id}
                        className="border rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <Checkbox
                          checked={isChecked}
                          onChange={() => handleTogglePermission(permission.id)}
                        >
                          <span className="font-medium">{action.label}</span>
                        </Checkbox>
                        {permission.description && (
                          <p className="text-xs text-gray-500 mt-1 ml-6">
                            {permission.description}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                {groupIndex < permissionGroups.length - 1 && (
                  <Divider className="my-6" />
                )}
              </div>
            );
          })}
        </motion.div>
      </Card>
    </div>
  );
};
