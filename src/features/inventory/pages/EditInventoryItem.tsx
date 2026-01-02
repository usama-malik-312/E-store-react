import { Card, Typography, Button, Spin } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { InventoryItemForm } from "../components/InventoryItemForm";
import { useUpdateInventoryItem, useInventoryItem } from "../hooks";
import { UpdateInventoryItemData } from "../types";

const { Title } = Typography;

export const EditInventoryItem = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const itemId = id ? parseInt(id) : null;

  const { data: inventoryItem, isLoading: itemLoading } = useInventoryItem(itemId);
  const updateMutation = useUpdateInventoryItem();

  const handleSubmit = (data: UpdateInventoryItemData) => {
    if (!itemId) return;

    updateMutation.mutate(
      { id: itemId, data },
      {
        onSuccess: () => {
          navigate("/inventory");
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
          <Title level={3}>Inventory item not found</Title>
          <Button onClick={handleCancel} className="mt-4">
            Back to Inventory
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
            Back
          </Button>
          <Title level={2} className="mb-0">
            Edit Inventory Item: {inventoryItem.item_name}
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


