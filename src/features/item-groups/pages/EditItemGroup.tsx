import { Card, Typography, Button, Spin } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ItemGroupForm } from "../components/ItemGroupForm";
import { useUpdateItemGroup, useItemGroup } from "../hooks";
import { UpdateItemGroupData } from "../types";

const { Title } = Typography;

export const EditItemGroup = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const itemGroupId = id ? parseInt(id) : null;

  const { data: itemGroup, isLoading: itemGroupLoading } = useItemGroup(itemGroupId);
  const updateMutation = useUpdateItemGroup();

  const handleSubmit = (data: UpdateItemGroupData) => {
    if (!itemGroupId) return;

    updateMutation.mutate(
      { id: itemGroupId, data },
      {
        onSuccess: () => {
          navigate("/item-groups");
        },
      }
    );
  };

  const handleCancel = () => {
    navigate("/item-groups");
  };

  if (itemGroupLoading) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  if (!itemGroup) {
    return (
      <div className="w-full">
        <Card>
          <Title level={3}>Item group not found</Title>
          <Button onClick={handleCancel} className="mt-4">
            Back to Item Groups
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
            Edit Item Group: {itemGroup.group_name}
          </Title>
        </div>

        <Card>
          <ItemGroupForm
            itemGroup={itemGroup}
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

