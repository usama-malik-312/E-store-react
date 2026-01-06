import { useState, useEffect, useMemo } from "react";
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
  Empty,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  WarningOutlined,
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
import type { TableColumnsType, TableProps } from "antd";

const { Title } = Typography;

// Debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const InventoryList = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<InventoryFilters>({});
  const [sortField, setSortField] = useState<string>("item_name");
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("ASC");

  const debouncedSearch = useDebounce(search, 500);

  const { data: stores = [] } = useStoresDropdown();
  const { data: brands = [] } = useBrandsDropdown();
  const { data: suppliers = [] } = useSuppliersDropdown();
  const { data: itemGroups = [] } = useItemGroupsDropdown();

  // Build sort string
  const sortString = useMemo(() => {
    return `${sortField} ${sortDirection}`;
  }, [sortField, sortDirection]);

  const { data: inventoryData, isLoading } = useInventoryItems(
    {
      ...filters,
      search: debouncedSearch || undefined,
      sort: sortString,
    },
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

  const handleStoreChange = (storeId: number | undefined) => {
    setFilters({ ...filters, store_id: storeId });
    setPage(1);
  };

  const handleFilterChange = (key: keyof InventoryFilters, value: any) => {
    setFilters({ ...filters, [key]: value || undefined });
    setPage(1);
  };

  const handleTableChange: TableProps<InventoryItem>["onChange"] = (
    pagination,
    tableFilters,
    sorter
  ) => {
    if (Array.isArray(sorter)) {
      // Handle multiple sorters if needed
      return;
    }

    if (sorter && sorter.field) {
      const field = sorter.field as string;
      const order = sorter.order;

      if (order === "ascend") {
        setSortField(field);
        setSortDirection("ASC");
      } else if (order === "descend") {
        setSortField(field);
        setSortDirection("DESC");
      } else {
        // Reset to default
        setSortField("item_name");
        setSortDirection("ASC");
      }
    }
  };

  const handleLowStockAlert = () => {
    // Navigate to low stock view or show modal
    // For now, we'll filter by low stock items
    // You can implement a dedicated low stock page later
    navigate("/inventory?low_stock=true");
  };

  const columns: TableColumnsType<InventoryItem> = [
    {
      title: t("inventory.itemCode") || "Item Code",
      dataIndex: "item_code",
      key: "item_code",
      sorter: true,
      width: 120,
    },
    {
      title: t("inventory.itemName") || "Item Name",
      dataIndex: "item_name",
      key: "item_name",
      sorter: true,
      width: 200,
    },
    {
      title: t("inventory.groupName") || "Group",
      dataIndex: "group_name",
      key: "group_name",
      render: (name: string, record: InventoryItem) => {
        const groupName =
          name ||
          record.item_group?.group_name ||
          (record as any).item_group_name;
        return groupName ? (
          <span>{groupName}</span>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
      width: 150,
    },
    {
      title: t("inventory.store") || "Store",
      dataIndex: "store_name",
      key: "store_name",
      render: (name: string, record: InventoryItem) => {
        const storeName =
          name ||
          record.store?.name ||
          (record as any).store_name;
        const storeLocation =
          (record as any).store_location || record.store?.location;
        return storeName ? (
          <div>
            <div className="font-medium">{storeName}</div>
            {storeLocation && (
              <div className="text-xs text-gray-400">{storeLocation}</div>
            )}
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
      width: 180,
    },
    {
      title: t("inventory.brand") || "Brand",
      dataIndex: "brand_name",
      key: "brand_name",
      render: (name: string, record: InventoryItem) => {
        const brandName =
          name ||
          record.brand?.name ||
          (record as any).brand_name;
        return brandName ? (
          <span>{brandName}</span>
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
      width: 120,
    },
    {
      title: t("inventory.stock") || "Stock",
      dataIndex: "stock",
      key: "stock",
      sorter: true,
      render: (stock: number, record: InventoryItem) => {
        const stockValue = stock || 0;
        const minStock = record.min_stock_level || 10;
        const isLowStock = stockValue < minStock;
        const isOutOfStock = stockValue === 0;
        return (
          <span
            className={
              isOutOfStock
                ? "text-red-600 font-semibold"
                : isLowStock
                ? "text-orange-500 font-semibold"
                : ""
            }
          >
            {stockValue} {record.unit || ""}
          </span>
        );
      },
      width: 120,
    },
    {
      title: t("inventory.sellingPrice") || "Selling Price",
      dataIndex: "selling_price",
      key: "selling_price",
      sorter: true,
      render: (price: number | string | undefined) => {
        const numPrice = typeof price === "string" ? parseFloat(price) : price;
        return numPrice && !isNaN(numPrice) ? `$${numPrice.toFixed(2)}` : "-";
      },
      width: 120,
    },
    {
      title: t("inventory.costPrice") || "Cost Price",
      dataIndex: "cost_price",
      key: "cost_price",
      sorter: true,
      render: (price: number | string | undefined) => {
        const numPrice = typeof price === "string" ? parseFloat(price) : price;
        return numPrice && !isNaN(numPrice) ? (
          `$${numPrice.toFixed(2)}`
        ) : (
          <span className="text-gray-400">-</span>
        );
      },
      width: 120,
    },
    {
      title: t("inventory.status") || "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status === "active"
            ? t("inventory.active") || "Active"
            : t("inventory.inactive") || "Inactive"}
        </Tag>
      ),
      width: 100,
    },
    {
      title: t("common.actions") || "Actions",
      key: "actions",
      fixed: "right",
      width: 150,
      render: (_: any, record: InventoryItem) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          >
            {t("common.edit") || "Edit"}
          </Button>
          <Popconfirm
            title={t("inventory.deleteConfirm") || "Are you sure you want to delete this item?"}
            onConfirm={() => handleDelete(record.id)}
            okText={t("common.yes") || "Yes"}
            cancelText={t("common.no") || "No"}
          >
            <Button type="link" danger icon={<DeleteOutlined />} size="small">
              {t("common.delete") || "Delete"}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>{t("inventory.title") || "Inventory Management"}</Title>
        <Space>
          <Button
            icon={<WarningOutlined />}
            onClick={handleLowStockAlert}
            size="large"
          >
            {t("inventory.lowStockAlert") || "Low Stock Alert"}
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
            size="large"
          >
            {t("inventory.addItem") || "Add New Item"}
          </Button>
        </Space>
      </div>

      <Card>
        <div className="mb-4 space-y-4">
          {/* Store Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {t("inventory.filterByStore") || "Filter by Store"}
            </label>
            <Select
              size="large"
              className="w-full max-w-md"
              placeholder={t("inventory.allStores") || "All Stores"}
              value={filters.store_id}
              onChange={handleStoreChange}
              allowClear
              options={[
                { label: t("inventory.allStores") || "All Stores", value: undefined },
                ...stores.map((store) => ({
                  label: store.name,
                  value: store.id,
                })),
              ]}
            />
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <Input
                placeholder={t("inventory.searchPlaceholder") || "Search by item name, code, or SKU"}
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

            {/* Item Group Filter */}
            <div>
              <Select
                size="large"
                className="w-full"
                placeholder={t("inventory.filterByGroup") || "Filter by Group"}
                allowClear
                value={filters.item_group_id}
                onChange={(value) => handleFilterChange("item_group_id", value)}
                options={[
                  { label: t("inventory.allGroups") || "All Groups", value: undefined },
                  ...itemGroups.map((group) => ({
                    label: group.name,
                    value: group.id,
                  })),
                ]}
              />
            </div>

            {/* Status Filter */}
            <div>
              <Select
                size="large"
                className="w-full"
                placeholder={t("inventory.filterByStatus") || "Filter by Status"}
                allowClear
                value={filters.status}
                onChange={(value) => handleFilterChange("status", value)}
                options={[
                  { label: t("common.all") || "All", value: undefined },
                  { label: t("inventory.active") || "Active", value: "active" },
                  { label: t("inventory.inactive") || "Inactive", value: "inactive" },
                ]}
              />
            </div>

            {/* Brand Filter */}
            <div>
              <Select
                size="large"
                className="w-full"
                placeholder={t("inventory.filterByBrand") || "Filter by Brand"}
                allowClear
                value={filters.brand_id}
                onChange={(value) => handleFilterChange("brand_id", value)}
                options={[
                  { label: t("inventory.allBrands") || "All Brands", value: undefined },
                  ...brands.map((brand) => ({
                    label: brand.name,
                    value: brand.id,
                  })),
                ]}
              />
            </div>

            {/* Supplier Filter */}
            <div>
              <Select
                size="large"
                className="w-full"
                placeholder={t("inventory.filterBySupplier") || "Filter by Supplier"}
                allowClear
                value={filters.supplier_id}
                onChange={(value) => handleFilterChange("supplier_id", value)}
                options={[
                  { label: t("inventory.allSuppliers") || "All Suppliers", value: undefined },
                  ...suppliers.map((supplier) => ({
                    label: supplier.name,
                    value: supplier.id,
                  })),
                ]}
              />
            </div>
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
            {itemsArray.length === 0 ? (
              <Empty
                description={t("inventory.noItemsFound") || "No inventory items found"}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ) : (
              <Table
                columns={columns}
                dataSource={itemsArray}
                rowKey="id"
                loading={isLoading}
                scroll={{ x: 1200 }}
                onChange={handleTableChange}
                pagination={{
                  current: page,
                  pageSize: limit,
                  total: (inventoryData as any)?.pagination?.total || 0,
                  showSizeChanger: true,
                  pageSizeOptions: ["10", "20", "50", "100"],
                  showTotal: (total, range) =>
                    `${t("common.showing") || "Showing"} ${range[0]}-${range[1]} ${t("common.of") || "of"} ${total} ${t("inventory.items") || "items"}`,
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
            )}
          </motion.div>
        )}
      </Card>
    </div>
  );
};
