import { Input, Button, Select } from "antd";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Store, CreateStoreData, UpdateStoreData } from "../types";

const storeSchema = z.object({
  name: z.string().min(1, "Store name is required"),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  status: z.string().optional(),
});

type StoreFormData = z.infer<typeof storeSchema>;

interface StoreFormProps {
  store?: Store;
  onSubmit: (data: CreateStoreData | UpdateStoreData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

export const StoreForm = ({
  store,
  onSubmit,
  onCancel,
  isLoading,
  isEdit,
}: StoreFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<StoreFormData>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: store?.name || "",
      address: store?.address || "",
      phone: store?.phone || "",
      email: store?.email || "",
      status: store?.status || "active",
    },
  });

  const onFormSubmit = (data: StoreFormData) => {
    onSubmit({
      name: data.name,
      address: data.address || undefined,
      phone: data.phone || undefined,
      email: data.email || undefined,
      status: data.status || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Store Name *</label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                placeholder="Enter store name"
                status={errors.name ? "error" : ""}
              />
            )}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Address</label>
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <Input.TextArea
                {...field}
                size="large"
                placeholder="Enter store address"
                rows={3}
                status={errors.address ? "error" : ""}
              />
            )}
          />
          {errors.address && (
            <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Phone</label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                placeholder="Enter phone number"
                status={errors.phone ? "error" : ""}
              />
            )}
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="email"
                size="large"
                placeholder="Enter email address"
                status={errors.email ? "error" : ""}
              />
            )}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                size="large"
                className="w-full"
                options={[
                  { label: "Active", value: "active" },
                  { label: "Inactive", value: "inactive" },
                ]}
              />
            )}
          />
        </div>

        <div className="md:col-span-2 flex justify-end gap-2 pt-4">
          <Button onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            {isEdit ? "Update" : "Create"} Store
          </Button>
        </div>
      </div>
    </form>
  );
};

