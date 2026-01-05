import { useState, useMemo } from "react";
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
import { useBrands, useDeleteBrand } from "../hooks";
import { Brand } from "../types";
import { useTranslation } from "react-i18next";

const { Title } = Typography;

export const BrandsList = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");

  const { data: brandsData, isLoading } = useBrands({ search }, page, limit);

  const brands = (brandsData as any)?.data || [];
  const brandsArray = Array.isArray(brands) ? brands : [];

  const deleteMutation = useDeleteBrand();

  const handleCreate = () => {
    navigate("/brands/create");
  };

  const handleEdit = (brand: Brand) => {
    navigate(`/brands/${brand.id}/edit`);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const columns = [
    {
      title: t("common.name"),
      dataIndex: "name",
      key: "name",
      sorter: true,
    },
    {
      title: t("common.description"),
      dataIndex: "description",
      key: "description",
      render: (desc: string) =>
        desc || <span className="text-gray-400">{t("common.noDescription")}</span>,
    },
    {
      title: t("common.createdAt"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) =>
        date ? new Date(date).toLocaleDateString() : "-",
    },
    {
      title: t("common.actions"),
      key: "actions",
      render: (_: any, record: Brand) => (
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
            title={t("brands.deleteConfirm")}
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
        <Title level={2}>{t("brands.title")}</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
          size="large"
        >
          {t("brands.addBrand")}
        </Button>
      </div>

      <Card>
        <div className="mb-4">
          <Input
            placeholder={t("brands.searchPlaceholder")}
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
              dataSource={brandsArray}
              rowKey="id"
              loading={isLoading}
              pagination={{
                current: page,
                pageSize: limit,
                total: (brandsData as any)?.pagination?.total || 0,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50", "100"],
                showTotal: (total) => `${t("common.total")} ${total} ${t("brands.title").toLowerCase()}`,
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
