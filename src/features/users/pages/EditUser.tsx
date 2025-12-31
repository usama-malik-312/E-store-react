import { Card, Typography, Button, Spin } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { UserForm } from "../components/UserForm";
import { useUpdateUser, useUser } from "../hooks";
import { UpdateUserData } from "../types";

const { Title } = Typography;

export const EditUser = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const userId = id ? parseInt(id) : null;

  const { data: user, isLoading: userLoading } = useUser(userId);
  const updateMutation = useUpdateUser();

  const handleSubmit = (data: UpdateUserData) => {
    if (!userId) return;

    updateMutation.mutate(
      { id: userId, data },
      {
        onSuccess: () => {
          navigate("/users");
        },
      }
    );
  };

  const handleCancel = () => {
    navigate("/users");
  };

  if (userLoading) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full">
        <Card>
          <Title level={3}>User not found</Title>
          <Button onClick={handleCancel} className="mt-4">
            Back to Users
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
            Edit User: {user.full_name}
          </Title>
        </div>

        <Card>
          <UserForm
            user={user}
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

