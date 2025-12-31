import { Card, Typography, Button, Spin } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { StoreForm } from "../components/StoreForm";
import { useUpdateStore, useStore } from "../hooks";
import { UpdateStoreData } from "../types";

const { Title } = Typography;

export const EditStore = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const storeId = id ? parseInt(id) : null;

  const { data: store, isLoading: storeLoading } = useStore(storeId);
  const updateMutation = useUpdateStore();

  const handleSubmit = (data: UpdateStoreData) => {
    if (!storeId) return;

    updateMutation.mutate(
      { id: storeId, data },
      {
        onSuccess: () => {
          navigate("/stores");
        },
      }
    );
  };

  const handleCancel = () => {
    navigate("/stores");
  };

  if (storeLoading) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  if (!store) {
    return (
      <div className="w-full">
        <Card>
          <Title level={3}>Store not found</Title>
          <Button onClick={handleCancel} className="mt-4">
            Back to Stores
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
            Edit Store: {store.name}
          </Title>
        </div>

        <Card>
          <StoreForm
            store={store}
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

