import { Input, Button, Select } from "antd";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Customer, CreateCustomerData, UpdateCustomerData } from "../types";
import { useTranslation } from "react-i18next";

const getCustomerSchema = (t: (key: string) => string) => z.object({
  name: z.string().min(1, t("customers.customerNameRequired")),
  customer_code: z.string().optional(),
  email: z.string().email(t("validation.emailInvalid")).optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  status: z.string().optional(),
});

interface CustomerFormProps {
  customer?: Customer;
  onSubmit: (data: CreateCustomerData | UpdateCustomerData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

export const CustomerForm = ({
  customer,
  onSubmit,
  onCancel,
  isLoading,
  isEdit,
}: CustomerFormProps) => {
  const { t } = useTranslation();
  const customerSchema = getCustomerSchema(t);
  type CustomerFormData = z.infer<typeof customerSchema>;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: customer?.name || "",
      customer_code: customer?.customer_code || "",
      email: customer?.email || "",
      phone: customer?.phone || "",
      address: customer?.address || "",
      status: customer?.status || "active",
    },
  });

  const onFormSubmit = (data: CustomerFormData) => {
    onSubmit({
      name: data.name,
      customer_code: data.customer_code || undefined,
      email: data.email || undefined,
      phone: data.phone || undefined,
      address: data.address || undefined,
      status: data.status || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">
            {t("customers.customerName")} *
          </label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                placeholder={t("customers.enterCustomerName")}
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
            {t("customers.customerCode")}
          </label>
          <Controller
            name="customer_code"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                placeholder={t("customers.enterCustomerCode")}
                status={errors.customer_code ? "error" : ""}
              />
            )}
          />
          {errors.customer_code && (
            <p className="text-red-500 text-xs mt-1">
              {errors.customer_code.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {t("common.status")}
          </label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                size="large"
                className="w-full"
                options={[
                  { label: t("inventory.active"), value: "active" },
                  { label: t("inventory.inactive"), value: "inactive" },
                ]}
              />
            )}
          />
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
                placeholder={t("customers.enterEmail")}
                status={errors.email ? "error" : ""}
              />
            )}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
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
                placeholder={t("customers.enterPhone")}
                status={errors.phone ? "error" : ""}
              />
            )}
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
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
                placeholder={t("customers.enterAddress")}
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
            {isEdit ? t("common.update") : t("common.create")} {t("customers.title").split(" ")[0]}
          </Button>
        </div>
      </div>
    </form>
  );
};
