import { InventoryItem } from "../inventory/types";
import { Customer } from "../customers/types";
import { Store } from "../stores/types";

export interface SaleItem {
  id?: number;
  inventory_id: number;
  quantity: number;
  unit_price: number;
  tax_percentage?: number;
  discount_percentage?: number;
  subtotal?: number;
  tax_amount?: number;
  discount_amount?: number;
  total?: number;
  // For display purposes
  inventory?: InventoryItem;
  item_name?: string;
  item_code?: string;
}

export interface CartItem {
  inventory_id: number;
  quantity: number;
  unit_price: number;
  tax_percentage?: number;
  discount_percentage?: number;
  // For display
  inventory?: InventoryItem;
}

export interface Sale {
  id: number;
  sale_number: string;
  store_id: number;
  customer_id?: number | null;
  user_id: number;
  total_amount: number;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  payment_method: "cash" | "card" | "credit" | "mixed";
  amount_paid: number;
  amount_due: number;
  payment_status: "paid" | "partial" | "pending";
  status: "completed" | "cancelled" | "refunded";
  notes?: string;
  sale_date: string;
  createdAt?: string;
  updatedAt?: string;
  // Relations
  store?: Store;
  customer?: Customer;
  user?: { id: number; full_name?: string; name?: string };
  items?: SaleItem[];
}

export interface CreateSaleData {
  store_id: number;
  customer_id?: number | null;
  items: Array<{
    inventory_id: number;
    quantity: number;
    unit_price?: number;
    tax_percentage?: number;
    discount_percentage?: number;
  }>;
  payment_method: "cash" | "card" | "credit" | "mixed";
  amount_paid: number;
  discount_amount?: number;
  notes?: string;
}

export interface SalesFilters {
  search?: string;
  store_id?: number;
  customer_id?: number;
  user_id?: number;
  payment_status?: "paid" | "partial" | "pending";
  status?: "completed" | "cancelled" | "refunded";
  start_date?: string;
  end_date?: string;
  sort?: string;
}

export interface SalesStatistics {
  total_sales: number;
  total_revenue: number;
  total_collected: number;
  total_outstanding: number;
  average_sale: number;
  sales_count: number;
}

export interface CartTotals {
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  changeDue: number;
}


