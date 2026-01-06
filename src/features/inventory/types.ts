export interface InventoryItem {
  id: number;
  item_name: string;
  item_code: string;
  store_id: number;
  store_name?: string;
  store_location?: string;
  brand_id?: number;
  brand_name?: string;
  supplier_id?: number;
  supplier_name?: string;
  item_group_id?: number;
  group_name?: string;
  selling_price: number;
  cost_price?: number;
  stock?: number;
  unit?: string;
  sku?: string;
  status?: string;
  description?: string;
  barcode?: string;
  min_stock_level?: number;
  tax_percentage?: number;
  discount?: number;
  image?: string;
  notes?: string;
  brand?: { id: number; name: string };
  supplier?: { id: number; name: string };
  item_group?: { id: number; group_name: string };
  store?: { id: number; name: string; location?: string };
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateInventoryItemData {
  item_name: string;
  item_code: string;
  store_id?: number;
  brand_id?: number;
  supplier_id?: number;
  item_group_id?: number;
  selling_price: number;
  cost_price?: number;
  stock?: number;
  unit?: string;
  sku?: string;
  status?: string;
  description?: string;
  barcode?: string;
  min_stock_level?: number;
  tax_percentage?: number;
  discount?: number;
  image?: string;
  notes?: string;
}

export interface UpdateInventoryItemData {
  item_name?: string;
  item_code?: string;
  store_id?: number;
  brand_id?: number;
  supplier_id?: number;
  item_group_id?: number;
  selling_price?: number;
  cost_price?: number;
  stock?: number;
  unit?: string;
  sku?: string;
  status?: string;
  description?: string;
  barcode?: string;
  min_stock_level?: number;
  tax_percentage?: number;
  discount?: number;
  image?: string;
  notes?: string;
}

export interface InventoryFilters {
  search?: string;
  store_id?: number;
  status?: string;
  brand_id?: number;
  supplier_id?: number;
  item_group_id?: number;
  sort?: string;
}

export interface LowStockItem extends InventoryItem {
  threshold?: number;
}


