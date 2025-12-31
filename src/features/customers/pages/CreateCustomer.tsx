import { Card, Typography, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CustomerForm } from "../components/CustomerForm";
import { useCreateCustomer } from "../hooks";
import { CreateCustomerData } from "../types";

const { Title } = Typography;

export const CreateCustomer = () => {
  const navigate = useNavigate();
  const createMutation = useCreateCustomer();

  const handleSubmit = (data: CreateCustomerData) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        navigate("/customers");
      },
    });
  };

  const handleCancel = () => {
    navigate("/customers");
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
            Create New Customer
          </Title>
        </div>

        <Card>
          <CustomerForm
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

