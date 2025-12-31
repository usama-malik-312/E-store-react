import { Card, Typography, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserForm } from "../components/UserForm";
import { useCreateUser } from "../hooks";
import { CreateUserData } from "../types";

const { Title } = Typography;

export const CreateUser = () => {
  const navigate = useNavigate();
  const createMutation = useCreateUser();

  const handleSubmit = (data: CreateUserData) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        navigate("/users");
      },
    });
  };

  const handleCancel = () => {
    navigate("/users");
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
            Create New User
          </Title>
        </div>

        <Card>
          <UserForm
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

