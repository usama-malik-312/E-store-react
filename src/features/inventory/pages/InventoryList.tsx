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
  Select,
  Tag,
  Alert,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useInventoryItems, useDeleteInventoryItem } from "../hooks";
import { InventoryItem, InventoryFilters } from "../types";
import { useStoresDropdown } from "@/features/stores/hooks";
import { useBrandsDropdown } from "@/features/brands/hooks";
import { useSuppliersDropdown } from "@/features/suppliers/hooks";
import { useItemGroupsDropdown } from "@/features/item-groups/hooks";
import { useTranslation } from "react-i18next";

const { Title } = Typography;

export const InventoryList = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<InventoryFilters>({});

  const { data: stores = [] } = useStoresDropdown();
  const { data: brands = [] } = useBrandsDropdown();
  const { data: suppliers = [] } = useSuppliersDropdown();
  const { data: itemGroups = [] } = useItemGroupsDropdown();

  const { data: inventoryData, isLoading } = useInventoryItems(
    { ...filters, search },
    page,
    limit
  );

  const items = (inventoryData as any)?.data || [];
  const itemsArray = Array.isArray(items) ? items : [];

  const deleteMutation = useDeleteInventoryItem();

  const handleCreate = () => {
    navigate("/inventory/create");
  };

  const handleEdit = (item: InventoryItem) => {
    navigate(`/inventory/${item.id}/edit`);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleStoreChange = (storeId: number) => {
    setFilters({ ...filters, store_id: storeId });
    setPage(1);
  };

  const handleFilterChange = (key: keyof InventoryFilters, value: any) => {
    setFilters({ ...filters, [key]: value || undefined });
    setPage(1);
  };

  const columns = [
    {
      title: t("inventory.itemCode"),
      dataIndex: "item_code",
      key: "item_code",
      sorter: true,
    },
    {
      title: t("inventory.itemName"),
      dataIndex: "item_name",
      key: "item_name",
      sorter: true,
    },
    {
      title: t("inventory.brand"),
      dataIndex: ["brand", "name"],
      key: "brand",
      render: (name: string) =>
        name || <span className="text-gray-400">-</span>,
    },
    {
      title: t("inventory.stock"),
      dataIndex: "stock",
      key: "stock",
      render: (stock: number, record: InventoryItem) => {
        const stockValue = stock || 0;
        const isLowStock = stockValue < 10;
        return (
          <span className={isLowStock ? "text-red-500 font-semibold" : ""}>
            {stockValue} {record.unit || ""}
          </span>
        );
      },
    },
    {
      title: t("inventory.sellingPrice"),
      dataIndex: "selling_price",
      key: "selling_price",
      render: (price: number | string | undefined) => {
        const numPrice = typeof price === "string" ? parseFloat(price) : price;
        return numPrice && !isNaN(numPrice) ? `$${numPrice.toFixed(2)}` : "-";
      },
    },
    {
      title: t("inventory.costPrice"),
      dataIndex: "cost_price",
      key: "cost_price",
      render: (price: number | string | undefined) => {
        const numPrice = typeof price === "string" ? parseFloat(price) : price;
        return numPrice && !isNaN(numPrice) ? (
          `$${numPrice.toFixed(2)}`
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
    },
    {
      title: t("inventory.status"),
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status === "active"
            ? t("inventory.active")
            : t("inventory.inactive")}
        </Tag>
      ),
    },
    {
      title: t("common.actions"),
      key: "actions",
      render: (_: any, record: InventoryItem) => (
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
            title={t("inventory.deleteConfirm")}
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
        <Title level={2}>{t("inventory.title")}</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
          size="large"
          disabled={!filters.store_id}
        >
          {t("inventory.addItem")}
        </Button>
      </div>

      <Card>
        {!filters.store_id && (
          <Alert
            message={t("inventory.selectStore")}
            type="info"
            showIcon
            className="mb-4"
          />
        )}

        <div className="mb-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {t("inventory.store")} *
            </label>
            <Select
              size="large"
              className="w-full max-w-md"
              placeholder={t("inventory.selectStore")}
              value={filters.store_id}
              onChange={handleStoreChange}
              options={stores.map((store) => ({
                label: store.name,
                value: store.id,
              }))}
            />
          </div>

          {filters.store_id && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Input
                  placeholder={t("inventory.searchPlaceholder")}
                  prefix={<SearchOutlined />}
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  size="large"
                  allowClear
                />
              </div>

              <div>
                <Select
                  size="large"
                  className="w-full"
                  placeholder={t("inventory.filterByStatus")}
                  allowClear
                  value={filters.status}
                  onChange={(value) => handleFilterChange("status", value)}
                  options={[
                    { label: t("inventory.active"), value: "active" },
                    { label: t("inventory.inactive"), value: "inactive" },
                  ]}
                />
              </div>

              <div>
                <Select
                  size="large"
                  className="w-full"
                  placeholder={t("inventory.filterByBrand")}
                  allowClear
                  value={filters.brand_id}
                  onChange={(value) => handleFilterChange("brand_id", value)}
                  options={brands.map((brand) => ({
                    label: brand.name,
                    value: brand.id,
                  }))}
                />
              </div>

              <div>
                <Select
                  size="large"
                  className="w-full"
                  placeholder={t("inventory.filterBySupplier")}
                  allowClear
                  value={filters.supplier_id}
                  onChange={(value) => handleFilterChange("supplier_id", value)}
                  options={suppliers.map((supplier) => ({
                    label: supplier.name,
                    value: supplier.id,
                  }))}
                />
              </div>

              <div>
                <Select
                  size="large"
                  className="w-full"
                  placeholder={t("inventory.filterByItemGroup")}
                  allowClear
                  value={filters.item_group_id}
                  onChange={(value) =>
                    handleFilterChange("item_group_id", value)
                  }
                  options={itemGroups.map((group) => ({
                    label: group.name,
                    value: group.id,
                  }))}
                />
              </div>
            </div>
          )}
        </div>

        {isLoading ? (
          <Skeleton active paragraph={{ rows: 8 }} />
        ) : filters.store_id ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Table
              columns={columns}
              dataSource={itemsArray}
              rowKey="id"
              loading={isLoading}
              pagination={{
                current: page,
                pageSize: limit,
                total: (inventoryData as any)?.pagination?.total || 0,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50", "100"],
                showTotal: (total) =>
                  `${t("common.total")} ${total} ${t(
                    "inventory.title"
                  ).toLowerCase()}`,
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
        ) : null}
      </Card>
    </div>
  );
};
