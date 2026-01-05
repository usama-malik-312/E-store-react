import { Input, Button } from "antd";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ItemGroup, CreateItemGroupData, UpdateItemGroupData } from "../types";
import { useTranslation } from "react-i18next";

const getItemGroupSchema = (t: (key: string) => string) => z.object({
  group_name: z.string().min(1, t("itemGroups.groupNameRequired")),
  description: z.string().optional(),
});

interface ItemGroupFormProps {
  itemGroup?: ItemGroup;
  onSubmit: (data: CreateItemGroupData | UpdateItemGroupData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

export const ItemGroupForm = ({
  itemGroup,
  onSubmit,
  onCancel,
  isLoading,
  isEdit,
}: ItemGroupFormProps) => {
  const { t } = useTranslation();
  const itemGroupSchema = getItemGroupSchema(t);
  type ItemGroupFormData = z.infer<typeof itemGroupSchema>;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ItemGroupFormData>({
    resolver: zodResolver(itemGroupSchema),
    defaultValues: {
      group_name: itemGroup?.group_name || "",
      description: itemGroup?.description || "",
    },
  });

  const onFormSubmit = (data: ItemGroupFormData) => {
    onSubmit({
      group_name: data.group_name,
      description: data.description || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">
            {t("itemGroups.groupName")} *
          </label>
          <Controller
            name="group_name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                placeholder={t("itemGroups.enterGroupName")}
                status={errors.group_name ? "error" : ""}
              />
            )}
          />
          {errors.group_name && (
            <p className="text-red-500 text-xs mt-1">{errors.group_name.message}</p>
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
                placeholder={t("itemGroups.enterDescription")}
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
            {isEdit ? t("common.update") : t("common.create")} {t("itemGroups.title").split(" ")[0]} {t("itemGroups.title").split(" ")[1]}
          </Button>
        </div>
      </div>
    </form>
  );
};
