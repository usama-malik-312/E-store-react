import { Card, Typography, Button, Spin } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { BrandForm } from "../components/BrandForm";
import { useUpdateBrand, useBrand } from "../hooks";
import { UpdateBrandData } from "../types";
import { useTranslation } from "react-i18next";

const { Title } = Typography;

export const EditBrand = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const brandId = id ? parseInt(id) : null;

  const { data: brand, isLoading: brandLoading } = useBrand(brandId);
  const updateMutation = useUpdateBrand();

  const handleSubmit = (data: UpdateBrandData) => {
    if (!brandId) return;

    updateMutation.mutate(
      { id: brandId, data },
      {
        onSuccess: () => {
          navigate("/brands");
        },
      }
    );
  };

  const handleCancel = () => {
    navigate("/brands");
  };

  if (brandLoading) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="w-full">
        <Card>
          <Title level={3}>{t("brands.title")} {t("messages.notFound")}</Title>
          <Button onClick={handleCancel} className="mt-4">
            {t("common.back")} {t("brands.title")}
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
            {t("common.back")}
          </Button>
          <Title level={2} className="mb-0">
            {t("brands.editBrand")}: {brand.name}
          </Title>
        </div>

        <Card>
          <BrandForm
            brand={brand}
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


