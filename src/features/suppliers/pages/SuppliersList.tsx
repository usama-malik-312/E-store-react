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
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useSuppliers, useDeleteSupplier } from "../hooks";
import { Supplier } from "../types";
import { useTranslation } from "react-i18next";

const { Title } = Typography;

export const SuppliersList = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");

  const { data: suppliersData, isLoading } = useSuppliers({ search }, page, limit);

  const suppliers = (suppliersData as any)?.data || [];
  const suppliersArray = Array.isArray(suppliers) ? suppliers : [];

  const deleteMutation = useDeleteSupplier();

  const handleCreate = () => {
    navigate("/suppliers/create");
  };

  const handleEdit = (supplier: Supplier) => {
    navigate(`/suppliers/${supplier.id}/edit`);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const columns = [
    {
      title: t("suppliers.supplierName"),
      dataIndex: "name",
      key: "name",
      sorter: true,
    },
    {
      title: t("suppliers.contactPerson"),
      dataIndex: "contact_person",
      key: "contact_person",
      render: (person: string) =>
        person || <span className="text-gray-400">-</span>,
    },
    {
      title: t("suppliers.phone"),
      dataIndex: "phone",
      key: "phone",
      render: (phone: string) =>
        phone || <span className="text-gray-400">-</span>,
    },
    {
      title: t("suppliers.email"),
      dataIndex: "email",
      key: "email",
      render: (email: string) =>
        email || <span className="text-gray-400">-</span>,
    },
    {
      title: t("suppliers.address"),
      dataIndex: "address",
      key: "address",
      render: (addr: string) =>
        addr || <span className="text-gray-400">-</span>,
    },
    {
      title: t("common.actions"),
      key: "actions",
      render: (_: any, record: Supplier) => (
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
            title={t("suppliers.deleteConfirm")}
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
        <Title level={2}>{t("suppliers.title")}</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
          size="large"
        >
          {t("suppliers.addSupplier")}
        </Button>
      </div>

      <Card>
        <div className="mb-4">
          <Input
            placeholder={t("suppliers.searchPlaceholder")}
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
              dataSource={suppliersArray}
              rowKey="id"
              loading={isLoading}
              pagination={{
                current: page,
                pageSize: limit,
                total: (suppliersData as any)?.pagination?.total || 0,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50", "100"],
                showTotal: (total) => `${t("common.total")} ${total} ${t("suppliers.title").toLowerCase()}`,
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
