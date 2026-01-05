import { Input, Button } from "antd";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Brand, CreateBrandData, UpdateBrandData } from "../types";
import { useTranslation } from "react-i18next";

const getBrandSchema = (t: (key: string) => string) => z.object({
  name: z.string().min(1, t("brands.brandNameRequired")),
  description: z.string().optional(),
});

interface BrandFormProps {
  brand?: Brand;
  onSubmit: (data: CreateBrandData | UpdateBrandData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

export const BrandForm = ({
  brand,
  onSubmit,
  onCancel,
  isLoading,
  isEdit,
}: BrandFormProps) => {
  const { t } = useTranslation();
  const brandSchema = getBrandSchema(t);
  type BrandFormData = z.infer<typeof brandSchema>;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BrandFormData>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: brand?.name || "",
      description: brand?.description || "",
    },
  });

  const onFormSubmit = (data: BrandFormData) => {
    onSubmit({
      name: data.name,
      description: data.description || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">
            {t("brands.brandName")} *
          </label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                placeholder={t("brands.enterBrandName")}
                status={errors.name ? "error" : ""}
              />
            )}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">
            {t("common.description")}
          </label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Input.TextArea
                {...field}
                size="large"
                placeholder={t("brands.enterDescription")}
                rows={4}
                status={errors.description ? "error" : ""}
              />
            )}
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="md:col-span-2 flex justify-end gap-2 pt-4">
          <Button onClick={onCancel} disabled={isLoading}>
            {t("common.cancel")}
          </Button>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            {isEdit ? t("common.update") : t("common.create")} {t("brands.title").split(" ")[0]}
          </Button>
        </div>
      </div>
    </form>
  );
};
