import { useState } from 'react';
import { Table, Button, Space, Tag, Popconfirm, Typography, Card, Skeleton, Badge } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SafetyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRoles, useDeleteRole } from '../hooks';
import { useCreateRole, useUpdateRole } from '../hooks';
import { usePermissions as usePermissionsList } from '../hooks';
import { RoleDrawer } from '../components/RoleDrawer';
import { Role, CreateRoleData, UpdateRoleData } from '../types';
import { usePermissions } from '@/hooks/usePermissions';

const { Title } = Typography;

export const RolesList = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | undefined>();

  const { canCreate, canUpdate, canDelete } = usePermissions();
  const canCreateRole = canCreate('role');
  const canUpdateRole = canUpdate('role');
  const canDeleteRole = canDelete('role');

  const { data: rolesData, isLoading: rolesLoading } = useRoles();
  const { data: permissions, isLoading: permissionsLoading } = usePermissionsList();

  // Extract roles array from paginated response
  const roles = rolesData?.data || [];
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
      title: 'Role Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Role, b: Role) => a.name.localeCompare(b.name),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (desc: string) => desc || <span className="text-gray-400">No description</span>,
    },
    {
      title: 'Total Permissions Assigned',
      dataIndex: 'permissions',
      key: 'permissions',
      render: (permissions: any[]) => (
        <div className="flex items-center gap-2">
          <Badge count={permissions?.length || 0} showZero color="blue" />
          <span className="text-gray-600 font-medium">
            {permissions?.length || 0} permission{permissions?.length !== 1 ? 's' : ''}
          </span>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Role) => (
        <Space>
          {canUpdateRole && (
            <>
              <Button
                type="link"
                icon={<SafetyOutlined />}
                onClick={() => navigate(`/roles/${record.id}/permissions`)}
                size="small"
              >
                Edit Permissions
              </Button>
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
                size="small"
              >
                Edit
              </Button>
            </>
          )}
          {canDeleteRole && (
            <Popconfirm
              title="Are you sure you want to delete this role?"
              description="Users with this role will need to be reassigned."
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" danger icon={<DeleteOutlined />} size="small">
                Delete
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  if (permissionsLoading) {
    return (
      <div>
        <Title level={2}>Roles & Permissions</Title>
        <Card>
          <Skeleton active paragraph={{ rows: 8 }} />
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>Roles & Permissions</Title>
        {canCreateRole && (
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate} size="large">
            Add Role
          </Button>
        )}
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
                showTotal: (total) => `Total ${total} roles`,
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

