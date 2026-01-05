import { Input, Button } from "antd";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Supplier, CreateSupplierData, UpdateSupplierData } from "../types";
import { useTranslation } from "react-i18next";

const getSupplierSchema = (t: (key: string) => string) => z.object({
  name: z.string().min(1, t("suppliers.supplierNameRequired")),
  contact_person: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email(t("validation.emailInvalid")).optional().or(z.literal("")),
  address: z.string().optional(),
});

interface SupplierFormProps {
  supplier?: Supplier;
  onSubmit: (data: CreateSupplierData | UpdateSupplierData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

export const SupplierForm = ({
  supplier,
  onSubmit,
  onCancel,
  isLoading,
  isEdit,
}: SupplierFormProps) => {
  const { t } = useTranslation();
  const supplierSchema = getSupplierSchema(t);
  type SupplierFormData = z.infer<typeof supplierSchema>;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: supplier?.name || "",
      contact_person: supplier?.contact_person || "",
      phone: supplier?.phone || "",
      email: supplier?.email || "",
      address: supplier?.address || "",
    },
  });

  const onFormSubmit = (data: SupplierFormData) => {
    onSubmit({
      name: data.name,
      contact_person: data.contact_person || undefined,
      phone: data.phone || undefined,
      email: data.email || undefined,
      address: data.address || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">
            {t("suppliers.supplierName")} *
          </label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                placeholder={t("suppliers.enterSupplierName")}
                status={errors.name ? "error" : ""}
              />
            )}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {t("suppliers.contactPerson")}
          </label>
          <Controller
            name="contact_person"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                placeholder={t("suppliers.enterContactPerson")}
                status={errors.contact_person ? "error" : ""}
              />
            )}
          />
          {errors.contact_person && (
            <p className="text-red-500 text-xs mt-1">
              {errors.contact_person.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {t("common.phone")}
          </label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                placeholder={t("suppliers.enterPhone")}
                status={errors.phone ? "error" : ""}
              />
            )}
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {t("common.email")}
          </label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="email"
                size="large"
                placeholder={t("suppliers.enterEmail")}
                status={errors.email ? "error" : ""}
              />
            )}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">
            {t("common.address")}
          </label>
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <Input.TextArea
                {...field}
                size="large"
                placeholder={t("suppliers.enterAddress")}
                rows={3}
                status={errors.address ? "error" : ""}
              />
            )}
          />
          {errors.address && (
            <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
          )}
        </div>

        <div className="md:col-span-2 flex justify-end gap-2 pt-4">
          <Button onClick={onCancel} disabled={isLoading}>
            {t("common.cancel")}
          </Button>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            {isEdit ? t("common.update") : t("common.create")} {t("suppliers.title").split(" ")[0]}
          </Button>
        </div>
      </div>
    </form>
  );
};
