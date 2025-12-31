import { Card, Typography, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { SupplierForm } from "../components/SupplierForm";
import { useCreateSupplier } from "../hooks";
import { CreateSupplierData } from "../types";

const { Title } = Typography;

export const CreateSupplier = () => {
  const navigate = useNavigate();
  const createMutation = useCreateSupplier();

  const handleSubmit = (data: CreateSupplierData) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        navigate("/suppliers");
      },
    });
  };

  const handleCancel = () => {
    navigate("/suppliers");
  };

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
            Create New Supplier
          </Title>
        </div>

        <Card>
          <SupplierForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={createMutation.isPending}
            isEdit={false}
          />
        </Card>
      </motion.div>
    </div>
  );
};

