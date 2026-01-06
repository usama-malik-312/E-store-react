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
import { useTranslation } from "react-i18next";

const getInventoryItemSchema = (t: (key: string) => string) =>
  z.object({
    item_name: z.string().min(1, t("inventory.itemNameRequired")),
    item_code: z.string().min(1, t("inventory.itemCodeRequired")),
    store_id: z.number().min(1, t("inventory.storeRequired")).optional().nullable(),
    brand_id: z.number().optional().nullable(),
    supplier_id: z.number().optional().nullable(),
    item_group_id: z.number().optional().nullable(),
    selling_price: z.number().min(0, t("inventory.sellingPriceRequired")),
    cost_price: z
      .number()
      .min(0, t("validation.positiveNumber"))
      .optional()
      .nullable(),
    stock: z
      .number()
      .min(0, t("validation.positiveNumber"))
      .optional()
      .nullable(),
    unit: z.string().optional(),
    sku: z.string().optional(),
    status: z.string().optional(),
    description: z.string().optional(),
    barcode: z.string().optional(),
    min_stock_level: z.number().min(0).optional().nullable(),
    tax_percentage: z.number().min(0).optional().nullable(),
    discount: z.number().min(0).optional().nullable(),
    image: z.string().optional(),
    notes: z.string().optional(),
  });

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
  const { t } = useTranslation();
  const { data: stores = [] } = useStoresDropdown();
  const { data: brands = [] } = useBrandsDropdown();
  const { data: suppliers = [] } = useSuppliersDropdown();
  const { data: itemGroups = [] } = useItemGroupsDropdown();

  const inventoryItemSchema = getInventoryItemSchema(t);
  type InventoryItemFormData = z.infer<typeof inventoryItemSchema>;

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
      description: "",
      barcode: "",
      min_stock_level: 5,
      tax_percentage: null,
      discount: null,
      image: "",
      notes: "",
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
        description: inventoryItem.description || "",
        barcode: inventoryItem.barcode || "",
        min_stock_level: inventoryItem.min_stock_level || null,
        tax_percentage: inventoryItem.tax_percentage || null,
        discount: inventoryItem.discount || null,
        image: inventoryItem.image || "",
        notes: inventoryItem.notes || "",
      });
    }
  }, [inventoryItem, reset]);

  const onFormSubmit = (data: InventoryItemFormData) => {
    console.log("Form Data===>", data);
    console.log("Form Errors===>", errors);

    const submitData = {
      item_name: data.item_name,
      item_code: data.item_code,
      store_id: data.store_id || undefined,
      brand_id: data.brand_id || undefined,
      supplier_id: data.supplier_id || undefined,
      item_group_id: data.item_group_id || undefined,
      selling_price: data.selling_price,
      cost_price: data.cost_price || undefined,
      stock: data.stock || undefined,
      unit: data.unit || undefined,
      sku: data.sku || undefined,
      status: data.status || undefined,
      description: data.description || undefined,
      barcode: data.barcode || undefined,
      min_stock_level: data.min_stock_level || undefined,
      tax_percentage: data.tax_percentage || undefined,
      discount: data.discount || undefined,
      image: data.image || undefined,
      notes: data.notes || undefined,
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
          <label className="block text-sm font-medium mb-2">
            {t("inventory.itemName")} *
          </label>
          <Controller
            name="item_name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                placeholder={t("inventory.enterItemName")}
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
          <label className="block text-sm font-medium mb-2">
            {t("inventory.itemCode")} *
          </label>
          <Controller
            name="item_code"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                placeholder={t("inventory.enterItemCode")}
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
          <label className="block text-sm font-medium mb-2">
            {t("inventory.sku")}
          </label>
          <Controller
            name="sku"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                placeholder={t("inventory.enterSKU")}
                status={errors.sku ? "error" : ""}
              />
            )}
          />
          {errors.sku && (
            <p className="text-red-500 text-xs mt-1">{errors.sku.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {t("inventory.store")}
          </label>
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
                placeholder={t("inventory.defaultStore") || "Default Store"}
                allowClear
                options={stores.map((store) => ({
                  label: store.name,
                  value: store.id,
                }))}
                status={errors.store_id ? "error" : ""}
              />
            )}
          />
          <p className="text-xs text-gray-500 mt-1">
            {t("inventory.storeHelperText") || "If not selected, item will be saved to default store"}
          </p>
          {errors.store_id && (
            <p className="text-red-500 text-xs mt-1">
              {errors.store_id.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {t("inventory.brand")}
          </label>
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
                placeholder={t("inventory.selectBrand")}
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
          <label className="block text-sm font-medium mb-2">
            {t("inventory.supplier")}
          </label>
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
                placeholder={t("inventory.selectSupplier")}
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
          <label className="block text-sm font-medium mb-2">
            {t("inventory.itemGroup")}
          </label>
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
                placeholder={t("inventory.selectItemGroup")}
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
                placeholder={t("inventory.enterSellingPrice")}
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
          <label className="block text-sm font-medium mb-2">
            {t("inventory.costPrice")}
          </label>
          <Controller
            name="cost_price"
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                size="large"
                className="w-full"
                placeholder={t("inventory.enterCostPrice")}
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
          <label className="block text-sm font-medium mb-2">
            {t("inventory.stock")}
          </label>
          <Controller
            name="stock"
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                size="large"
                className="w-full"
                placeholder={t("inventory.enterStock")}
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
          <label className="block text-sm font-medium mb-2">
            {t("inventory.unit")}
          </label>
          <Controller
            name="unit"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                placeholder={t("inventory.enterUnit")}
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {t("inventory.status")}
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
                  { label: "Active", value: "active" },
                  { label: "Inactive", value: "inactive" },
                ]}
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {t("inventory.barcode") || "Barcode"}
          </label>
          <Controller
            name="barcode"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                placeholder={t("inventory.enterBarcode") || "Enter barcode"}
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {t("inventory.minStockLevel") || "Min Stock Level"}
          </label>
          <Controller
            name="min_stock_level"
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                size="large"
                className="w-full"
                placeholder={t("inventory.enterMinStockLevel") || "Enter min stock level"}
                min={0}
                defaultValue={5}
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {t("inventory.taxPercentage") || "Tax Percentage"}
          </label>
          <Controller
            name="tax_percentage"
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                size="large"
                className="w-full"
                placeholder={t("inventory.enterTaxPercentage") || "Enter tax percentage"}
                min={0}
                max={100}
                step={0.01}
                formatter={(value) => `${value}%`}
                parser={(value) => {
                  const parsed = value!.replace("%", "");
                  return parsed ? parseFloat(parsed) : 0;
                }}
              />
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {t("inventory.discount") || "Discount"}
          </label>
          <Controller
            name="discount"
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                size="large"
                className="w-full"
                placeholder={t("inventory.enterDiscount") || "Enter discount"}
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
          <label className="block text-sm font-medium mb-2">
            {t("inventory.image") || "Image URL"}
          </label>
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                size="large"
                placeholder={t("inventory.enterImageUrl") || "Enter image URL"}
              />
            )}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">
            {t("inventory.description") || "Description"}
          </label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Input.TextArea
                {...field}
                rows={3}
                placeholder={t("inventory.enterDescription") || "Enter description"}
              />
            )}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">
            {t("inventory.notes") || "Notes"}
          </label>
          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <Input.TextArea
                {...field}
                rows={3}
                placeholder={t("inventory.enterNotes") || "Enter notes"}
              />
            )}
          />
        </div>

        <div className="md:col-span-2 flex justify-end gap-2 pt-4">
          <Button onClick={onCancel} disabled={isLoading}>
            {t("common.cancel")}
          </Button>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            {isEdit ? t("common.update") : t("common.create")}{" "}
            {t("inventory.title").split(" ")[0]}
          </Button>
        </div>
      </div>
    </form>
  );
};
