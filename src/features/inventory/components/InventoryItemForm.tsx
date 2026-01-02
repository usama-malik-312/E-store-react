import { Input, Button, Select, InputNumber } from "antd";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import {
  InventoryItem,
  CreateInventoryItemData,
  UpdateInventoryItemData,
} from "../types";
import { useStoresDropdown } from "@/features/stores/hooks";
import { useBrandsDropdown } from "@/features/brands/hooks";
import { useSuppliersDropdown } from "@/features/suppliers/hooks";
import { useItemGroupsDropdown } from "@/features/item-groups/hooks";

const inventoryItemSchema = z.object({
  item_name: z.string().min(1, "Item name is required"),
  item_code: z.string().min(1, "Item code is required"),
  store_id: z.number().min(1, "Store is required"),
  brand_id: z.number().optional().nullable(),
  supplier_id: z.number().optional().nullable(),
  item_group_id: z.number().optional().nullable(),
  selling_price: z.number().min(0, "Selling price must be positive"),
  cost_price: z
    .number()
    .min(0, "Cost price must be positive")
    .optional()
    .nullable(),
  stock: z.number().min(0, "Stock must be positive").optional().nullable(),
  unit: z.string().optional(),
  sku: z.string().optional(),
  status: z.string().optional(),
});

type InventoryItemFormData = z.infer<typeof inventoryItemSchema>;

interface InventoryItemFormProps {
  inventoryItem?: InventoryItem;
  onSubmit: (data: CreateInventoryItemData | UpdateInventoryItemData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

export const InventoryItemForm = ({
  inventoryItem,
  onSubmit,
  onCancel,
  isLoading,
  isEdit,
}: InventoryItemFormProps) => {
  const { data: stores = [] } = useStoresDropdown();
  const { data: brands = [] } = useBrandsDropdown();
  const { data: suppliers = [] } = useSuppliersDropdown();
  const { data: itemGroups = [] } = useItemGroupsDropdown();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InventoryItemFormData>({
    resolver: zodResolver(inventoryItemSchema),
    defaultValues: {
      item_name: "",
      item_code: "",
      store_id: undefined,
      brand_id: null,
      supplier_id: null,
      item_group_id: null,
      selling_price: 0,
      cost_price: null,
      stock: null,
      unit: "",
      sku: "",
      status: "active",
    },
  });

  // Reset form when inventoryItem data loads (for edit mode)
  useEffect(() => {
    if (inventoryItem) {
      reset({
        item_name: inventoryItem.item_name || "",
        item_code: inventoryItem.item_code || "",
        store_id: inventoryItem.store_id || undefined,
        brand_id: inventoryItem.brand_id || null,
        supplier_id: inventoryItem.supplier_id || null,
        item_group_id: inventoryItem.item_group_id || null,
        selling_price: inventoryItem.selling_price || 0,
        cost_price: inventoryItem.cost_price || null,
        stock: inventoryItem.stock || null,
        unit: inventoryItem.unit || "",
        sku: inventoryItem.sku || "",
        status: inventoryItem.status || "active",
      });
    }
  }, [inventoryItem, reset]);

  const onFormSubmit = (data: InventoryItemFormData) => {
    console.log("Form Data===>", data);
    console.log("Form Errors===>", errors);

    const submitData = {
      item_name: data.item_name,
      item_code: data.item_code,
      store_id: data.store_id,
      brand_id: data.brand_id || undefined,
      supplier_id: data.supplier_id || undefined,
      item_group_id: data.item_group_id || undefined,
      selling_price: data.selling_price,
      cost_price: data.cost_price || undefined,
      stock: data.stock || undefined,
      unit: data.unit || undefined,
      sku: data.sku || undefined,
      status: data.status || undefined,
    };

    console.log("Submitting data===>", submitData);
    onSubmit(submitData);
  };

  const onFormError = (errors: any) => {
    console.log("Form validation errors===>", errors);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit, onFormError)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Item Name *</label>
          <Controller
            name="item_name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                placeholder="Enter item name"
                status={errors.item_name ? "error" : ""}
              />
            )}
          />
          {errors.item_name && (
            <p className="text-red-500 text-xs mt-1">
              {errors.item_name.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Item Code *</label>
          <Controller
            name="item_code"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                placeholder="Enter item code"
                status={errors.item_code ? "error" : ""}
              />
            )}
          />
          {errors.item_code && (
            <p className="text-red-500 text-xs mt-1">
              {errors.item_code.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">SKU</label>
          <Controller
            name="sku"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                placeholder="Enter SKU"
                status={errors.sku ? "error" : ""}
              />
            )}
          />
          {errors.sku && (
            <p className="text-red-500 text-xs mt-1">{errors.sku.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Store *</label>
          <Controller
            name="store_id"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                size="large"
                className="w-full"
                placeholder="Select store"
                options={stores.map((store) => ({
                  label: store.name,
                  value: store.id,
                }))}
                status={errors.store_id ? "error" : ""}
              />
            )}
          />
          {errors.store_id && (
            <p className="text-red-500 text-xs mt-1">
              {errors.store_id.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Brand</label>
          <Controller
            name="brand_id"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                size="large"
                className="w-full"
                placeholder="Select brand"
                allowClear
                options={brands.map((brand) => ({
                  label: brand.name,
                  value: brand.id,
                }))}
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Supplier</label>
          <Controller
            name="supplier_id"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                size="large"
                className="w-full"
                placeholder="Select supplier"
                allowClear
                options={suppliers.map((supplier) => ({
                  label: supplier.name,
                  value: supplier.id,
                }))}
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Item Group</label>
          <Controller
            name="item_group_id"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                size="large"
                className="w-full"
                placeholder="Select item group"
                allowClear
                options={itemGroups.map((group) => ({
                  label: group.name,
                  value: group.id,
                }))}
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Selling Price *
          </label>
          <Controller
            name="selling_price"
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                size="large"
                className="w-full"
                placeholder="Enter selling price"
                min={0}
                step={0.01}
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => {
                  const parsed = value!.replace(/\$\s?|(,*)/g, "");
                  return parsed ? parseFloat(parsed) : 0;
                }}
                status={errors.selling_price ? "error" : ""}
              />
            )}
          />
          {errors.selling_price && (
            <p className="text-red-500 text-xs mt-1">
              {errors.selling_price.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Cost Price</label>
          <Controller
            name="cost_price"
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                size="large"
                className="w-full"
                placeholder="Enter cost price"
                min={0}
                step={0.01}
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => {
                  const parsed = value!.replace(/\$\s?|(,*)/g, "");
                  return parsed ? parseFloat(parsed) : 0;
                }}
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Stock</label>
          <Controller
            name="stock"
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                size="large"
                className="w-full"
                placeholder="Enter stock quantity"
                min={0}
                status={errors.stock ? "error" : ""}
              />
            )}
          />
          {errors.stock && (
            <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Unit</label>
          <Controller
            name="unit"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                placeholder="Enter unit (e.g., pcs, kg, etc.)"
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
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
            {isEdit ? "Update" : "Create"} Item
          </Button>
        </div>
      </div>
    </form>
  );
};
