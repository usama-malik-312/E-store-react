import { Card, Typography, Button, Spin } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { SupplierForm } from "../components/SupplierForm";
import { useUpdateSupplier, useSupplier } from "../hooks";
import { UpdateSupplierData } from "../types";

const { Title } = Typography;

export const EditSupplier = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const supplierId = id ? parseInt(id) : null;

  const { data: supplier, isLoading: supplierLoading } = useSupplier(supplierId);
  const updateMutation = useUpdateSupplier();

  const handleSubmit = (data: UpdateSupplierData) => {
    if (!supplierId) return;

    updateMutation.mutate(
      { id: supplierId, data },
      {
        onSuccess: () => {
          navigate("/suppliers");
        },
      }
    );
  };

  const handleCancel = () => {
    navigate("/suppliers");
  };

  if (supplierLoading) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="w-full">
        <Card>
          <Title level={3}>Supplier not found</Title>
          <Button onClick={handleCancel} className="mt-4">
            Back to Suppliers
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
            Edit Supplier: {supplier.name}
          </Title>
        </div>

        <Card>
          <SupplierForm
            supplier={supplier}
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


