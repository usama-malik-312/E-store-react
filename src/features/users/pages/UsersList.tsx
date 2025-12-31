import { useState } from "react";
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Popconfirm,
  Typography,
  Card,
  Skeleton,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useUsers, useDeleteUser } from "../hooks";
import { User } from "../types";
// import { usePermissions } from "@/hooks/usePermissions";

const { Title } = Typography;
const { Option } = Select;

export const UsersList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  // const { canCreate, canUpdate, canDelete } = usePermissions();
  // const canCreateUser = canCreate("user");
  // const canUpdateUser = canUpdate("user");
  // const canDeleteUser = canDelete("user");

  const { data: usersData, isLoading } = useUsers(
    {
      search,
      role: roleFilter || undefined,
      status: statusFilter || undefined,
    },
    page,
    limit
  );

  // Extract users array and pagination from response
  const users = (usersData as any)?.data || [];
  const usersArray = Array.isArray(users) ? users : [];

  const deleteMutation = useDeleteUser();

  const handleCreate = () => {
    navigate("/users/create");
  };

  const handleEdit = (user: User) => {
    navigate(`/users/${user.id}/edit`);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "full_name",
      key: "full_name",
      sorter: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: string) => {
        const colorMap: Record<string, string> = {
          owner: "purple",
          admin: "red",
          manager: "blue",
          staff: "green",
        };
        return (
          <Tag color={colorMap[role] || "default"}>{role.toUpperCase()}</Tag>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          active: "green",
          inactive: "gray",
          suspended: "red",
        };
        return (
          <Tag color={colorMap[status] || "default"}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: User) => (
        <Space>
          {/* {canUpdateUser && ( */}
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          >
            Edit
          </Button>
          {/* )} */}
          {/* {canDeleteUser && ( */}
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />} size="small">
              Delete
            </Button>
          </Popconfirm>
          {/* )} */}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>Users Management</Title>
        {/* {canCreateUser && ( */}
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
          size="large"
        >
          Add User
        </Button>
        {/* )} */}
      </div>

      <Card>
        <div className="mb-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search by name or email..."
              prefix={<SearchOutlined />}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              size="large"
              allowClear
            />
            <Select
              placeholder="Filter by role"
              value={roleFilter}
              onChange={(value) => {
                setRoleFilter(value);
                setPage(1);
              }}
              size="large"
              allowClear
              className="w-full"
            >
              <Option value="owner">Owner</Option>
              <Option value="admin">Admin</Option>
              <Option value="manager">Manager</Option>
              <Option value="staff">Staff</Option>
            </Select>
            <Select
              placeholder="Filter by status"
              value={statusFilter}
              onChange={(value) => {
                setStatusFilter(value);
                setPage(1);
              }}
              size="large"
              allowClear
              className="w-full"
            >
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
              <Option value="suspended">Suspended</Option>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <Skeleton active paragraph={{ rows: 8 }} />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Table
              columns={columns}
              dataSource={usersArray}
              rowKey="id"
              loading={isLoading}
              pagination={{
                current: page,
                pageSize: limit,
                total: (usersData as any)?.pagination?.total || 0,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50", "100"],
                showTotal: (total) => `Total ${total} users`,
                onChange: (newPage, newPageSize) => {
                  setPage(newPage);
                  if (newPageSize !== limit) {
                    setLimit(newPageSize);
                    setPage(1); // Reset to first page when page size changes
                  }
                },
                onShowSizeChange: (_, newPageSize) => {
                  setLimit(newPageSize);
                  setPage(1); // Reset to first page when page size changes
                },
              }}
            />
          </motion.div>
        )}
      </Card>
    </div>
  );
};
