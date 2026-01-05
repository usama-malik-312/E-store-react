import { Card, Typography, Button, Spin } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { InventoryItemForm } from "../components/InventoryItemForm";
import { useUpdateInventoryItem, useInventoryItem } from "../hooks";
import { UpdateInventoryItemData } from "../types";
import { useTranslation } from "react-i18next";

const { Title } = Typography;

export const EditInventoryItem = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const itemId = id ? parseInt(id) : null;

  const { data: inventoryItem, isLoading: itemLoading } =
    useInventoryItem(itemId);
  const updateMutation = useUpdateInventoryItem();

  const handleSubmit = (data: UpdateInventoryItemData) => {
    if (!itemId) {
      return;
    }

    updateMutation.mutate(
      { id: itemId, data },
      {
        onSuccess: () => {
          navigate("/inventory");
        },
        onError: (error) => {
          console.error("Update error:", error);
        },
      }
    );
  };

  const handleCancel = () => {
    navigate("/inventory");
  };

  if (itemLoading) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  if (!inventoryItem) {
    return (
      <div className="w-full">
        <Card>
          <Title level={3}>{t("inventory.notFound")}</Title>
          <Button onClick={handleCancel} className="mt-4">
            {t("inventory.backToInventory")}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-4 mb-6">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={handleCancel}
            type="text"
            size="large"
          >
            {t("common.back")}
          </Button>
          <Title level={2} className="mb-0">
            {t("inventory.editItem")}: {inventoryItem.item_name}
          </Title>
        </div>

        <Card>
          <InventoryItemForm
            inventoryItem={inventoryItem}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={updateMutation.isPending}
            isEdit={true}
          />
        </Card>
      </motion.div>
    </div>
  );
};
