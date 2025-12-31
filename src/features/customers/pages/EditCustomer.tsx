import { Card, Typography, Button, Spin } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CustomerForm } from "../components/CustomerForm";
import { useUpdateCustomer, useCustomer } from "../hooks";
import { UpdateCustomerData } from "../types";

const { Title } = Typography;

export const EditCustomer = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const customerId = id ? parseInt(id) : null;

  const { data: customer, isLoading: customerLoading } = useCustomer(customerId);
  const updateMutation = useUpdateCustomer();

  const handleSubmit = (data: UpdateCustomerData) => {
    if (!customerId) return;

    updateMutation.mutate(
      { id: customerId, data },
      {
        onSuccess: () => {
          navigate("/customers");
        },
      }
    );
  };

  const handleCancel = () => {
    navigate("/customers");
  };

  if (customerLoading) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="w-full">
        <Card>
          <Title level={3}>Customer not found</Title>
          <Button onClick={handleCancel} className="mt-4">
            Back to Customers
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
            Edit Customer: {customer.name}
          </Title>
        </div>

        <Card>
          <CustomerForm
            customer={customer}
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

