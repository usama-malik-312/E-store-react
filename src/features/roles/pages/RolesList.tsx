import { useState } from "react";
import {
  Table,
  Button,
  Space,
  Popconfirm,
  Typography,
  Card,
  Skeleton,
  Badge,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SafetyOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useRoles, useDeleteRole } from "../hooks";
import { useCreateRole, useUpdateRole } from "../hooks";
import { usePermissions as usePermissionsList } from "../hooks";
import { RoleDrawer } from "../components/RoleDrawer";
import { Role, CreateRoleData, UpdateRoleData } from "../types";
import { useTranslation } from "react-i18next";

const { Title } = Typography;

export const RolesList = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | undefined>();

  const { data: rolesData, isLoading: rolesLoading } = useRoles();
  const { data: permissions, isLoading: permissionsLoading } =
    usePermissionsList();

  const roles = (rolesData as any)?.data || [];
  const rolesArray = Array.isArray(roles) ? roles : [];

  const createMutation = useCreateRole();
  const updateMutation = useUpdateRole();
  const deleteMutation = useDeleteRole();

  const handleCreate = () => {
    setEditingRole(undefined);
    setDrawerOpen(true);
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setDrawerOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleSubmit = (formData: CreateRoleData | UpdateRoleData) => {
    if (editingRole) {
      updateMutation.mutate(
        { id: editingRole.id, data: formData },
        {
          onSuccess: () => {
            setDrawerOpen(false);
            setEditingRole(undefined);
          },
        }
      );
    } else {
      createMutation.mutate(formData as CreateRoleData, {
        onSuccess: () => {
          setDrawerOpen(false);
        },
      });
    }
  };

  const columns = [
    {
      title: t("roles.roleName"),
      dataIndex: "name",
      key: "name",
      sorter: (a: Role, b: Role) => a.name.localeCompare(b.name),
    },
    {
      title: t("common.description"),
      dataIndex: "description",
      key: "description",
      render: (desc: string) =>
        desc || <span className="text-gray-400">{t("common.noDescription")}</span>,
    },
    {
      title: t("roles.totalPermissionsAssigned"),
      dataIndex: "permissions",
      key: "permissions",
      render: (permissions: any[]) => {
        const count = permissions?.length || 0;
        return (
          <div className="flex items-center gap-2">
            <Badge count={count} showZero color="blue" />
            <span className="text-gray-600 font-medium">
              {count} {count === 1 ? t("common.permission") : t("common.permissions")}
            </span>
          </div>
        );
      },
    },
    {
      title: t("common.actions"),
      key: "actions",
      render: (_: any, record: Role) => (
        <Space>
          <Button
            type="link"
            icon={<SafetyOutlined />}
            onClick={() => navigate(`/roles/${record.id}/permissions`)}
            size="small"
          >
            {t("roles.editPermissions")}
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          >
            {t("common.edit")}
          </Button>
          <Popconfirm
            title={t("roles.deleteConfirm")}
            description={t("roles.deleteDescription")}
            onConfirm={() => handleDelete(record.id)}
            okText={t("common.yes")}
            cancelText={t("common.no")}
          >
            <Button type="link" danger icon={<DeleteOutlined />} size="small">
              {t("common.delete")}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (permissionsLoading) {
    return (
      <div>
        <Title level={2}>{t("roles.title")}</Title>
        <Card>
          <Skeleton active paragraph={{ rows: 8 }} />
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>{t("roles.title")}</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
          size="large"
        >
          {t("roles.addRole")}
        </Button>
      </div>

      <Card>
        {rolesLoading ? (
          <Skeleton active paragraph={{ rows: 8 }} />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Table
              columns={columns}
              dataSource={rolesArray}
              rowKey="id"
              loading={rolesLoading}
              pagination={{
                pageSize: 20,
                showSizeChanger: true,
                showTotal: (total) => `${t("common.total")} ${total} ${t("roles.title").toLowerCase()}`,
              }}
            />
          </motion.div>
        )}
      </Card>

      {permissions && (
        <RoleDrawer
          open={drawerOpen}
          onClose={() => {
            setDrawerOpen(false);
            setEditingRole(undefined);
          }}
          role={editingRole}
          permissions={permissions}
          onSubmit={handleSubmit}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      )}
    </div>
  );
};
