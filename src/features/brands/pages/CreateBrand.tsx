import { Card, Typography, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BrandForm } from "../components/BrandForm";
import { useCreateBrand } from "../hooks";
import { CreateBrandData } from "../types";
import { useTranslation } from "react-i18next";

const { Title } = Typography;

export const CreateBrand = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const createMutation = useCreateBrand();

  const handleSubmit = (data: CreateBrandData) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        navigate("/brands");
      },
    });
  };

  const handleCancel = () => {
    navigate("/brands");
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
            {t("common.back")}
          </Button>
          <Title level={2} className="mb-0">
            {t("brands.createBrand")}
          </Title>
        </div>

        <Card>
          <BrandForm
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


