import { Input, Button } from "antd";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Brand, CreateBrandData, UpdateBrandData } from "../types";

const brandSchema = z.object({
  name: z.string().min(1, "Brand name is required"),
  description: z.string().optional(),
});

type BrandFormData = z.infer<typeof brandSchema>;

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
          <label className="block text-sm font-medium mb-2">Brand Name *</label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                placeholder="Enter brand name"
                status={errors.name ? "error" : ""}
              />
            )}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Description</label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Input.TextArea
                {...field}
                size="large"
                placeholder="Enter brand description"
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
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            {isEdit ? "Update" : "Create"} Brand
          </Button>
        </div>
      </div>
    </form>
  );
};


