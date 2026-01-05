import { useState } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Popconfirm,
  Typography,
  Card,
  Skeleton,
  Tabs,
  Tag,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCustomers, useDeleteCustomer } from "../hooks";
import { Customer } from "../types";
import { useTranslation } from "react-i18next";

const { Title } = Typography;

export const CustomersList = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("active");

  const { data: customersData, isLoading } = useCustomers(
    { search, status },
    page,
    limit
  );

  const customers = (customersData as any)?.data || [];
  const customersArray = Array.isArray(customers) ? customers : [];

  const deleteMutation = useDeleteCustomer();

  const handleCreate = () => {
    navigate("/customers/create");
  };

  const handleEdit = (customer: Customer) => {
    navigate(`/customers/${customer.id}/edit`);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setPage(1);
  };

  const columns = [
    {
      title: t("common.name"),
      dataIndex: "name",
      key: "name",
      sorter: true,
    },
    {
      title: t("customers.customerCode"),
      dataIndex: "customer_code",
      key: "customer_code",
      render: (code: string) =>
        code || <span className="text-gray-400">-</span>,
    },
    {
      title: t("common.email"),
      dataIndex: "email",
      key: "email",
      render: (email: string) =>
        email || <span className="text-gray-400">-</span>,
    },
    {
      title: t("common.phone"),
      dataIndex: "phone",
      key: "phone",
      render: (phone: string) =>
        phone || <span className="text-gray-400">-</span>,
    },
    {
      title: t("common.status"),
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status === "active" ? t("inventory.active") : t("inventory.inactive")}
        </Tag>
      ),
    },
    {
      title: t("common.actions"),
      key: "actions",
      render: (_: any, record: Customer) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          >
            {t("common.edit")}
          </Button>
          <Popconfirm
            title={t("customers.deleteConfirm")}
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>{t("customers.title")}</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
          size="large"
        >
          {t("customers.addCustomer")}
        </Button>
      </div>

      <Card>
        <Tabs
          activeKey={status}
          onChange={handleStatusChange}
          items={[
            { key: "active", label: t("customers.activeCustomers") },
            { key: "inactive", label: t("customers.inactiveCustomers") },
          ]}
          className="mb-4"
        />

        <div className="mb-4">
          <Input
            placeholder={t("customers.searchPlaceholder")}
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            size="large"
            allowClear
            className="max-w-md"
          />
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
              dataSource={customersArray}
              rowKey="id"
              loading={isLoading}
              pagination={{
                current: page,
                pageSize: limit,
                total: (customersData as any)?.pagination?.total || 0,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50", "100"],
                showTotal: (total) => `${t("common.total")} ${total} ${t("customers.title").toLowerCase()}`,
                onChange: (newPage, newPageSize) => {
                  setPage(newPage);
                  if (newPageSize !== limit) {
                    setLimit(newPageSize);
                    setPage(1);
                  }
                },
                onShowSizeChange: (_, newPageSize) => {
                  setLimit(newPageSize);
                  setPage(1);
                },
              }}
            />
          </motion.div>
        )}
      </Card>
    </div>
  );
};
