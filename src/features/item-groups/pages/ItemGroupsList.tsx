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
import { useItemGroups, useDeleteItemGroup } from "../hooks";
import { ItemGroup } from "../types";
import { useTranslation } from "react-i18next";

const { Title } = Typography;

export const ItemGroupsList = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");

  const { data: itemGroupsData, isLoading } = useItemGroups({ search }, page, limit);

  const itemGroups = (itemGroupsData as any)?.data || [];
  const itemGroupsArray = Array.isArray(itemGroups) ? itemGroups : [];

  const deleteMutation = useDeleteItemGroup();

  const handleCreate = () => {
    navigate("/item-groups/create");
  };

  const handleEdit = (itemGroup: ItemGroup) => {
    navigate(`/item-groups/${itemGroup.id}/edit`);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const columns = [
    {
      title: t("itemGroups.groupName"),
      dataIndex: "group_name",
      key: "group_name",
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
      render: (_: any, record: ItemGroup) => (
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
            title={t("itemGroups.deleteConfirm")}
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
        <Title level={2}>{t("itemGroups.title")}</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
          size="large"
        >
          {t("itemGroups.addItemGroup")}
        </Button>
      </div>

      <Card>
        <div className="mb-4">
          <Input
            placeholder={t("itemGroups.searchPlaceholder")}
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
              dataSource={itemGroupsArray}
              rowKey="id"
              loading={isLoading}
              pagination={{
                current: page,
                pageSize: limit,
                total: (itemGroupsData as any)?.pagination?.total || 0,
                showSizeChanger: true,
                pageSizeOptions: ["10", "20", "50", "100"],
                showTotal: (total) => `${t("common.total")} ${total} ${t("itemGroups.title").toLowerCase()}`,
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
