import { Card, Empty, Divider } from "antd";
import { CartItem as CartItemType } from "../types";
import { CartItem } from "./CartItem";
import { formatCurrency } from "../utils/calculations";

interface CartProps {
  items: CartItemType[];
  onUpdateQuantity: (inventoryId: number, quantity: number) => void;
  onRemove: (inventoryId: number) => void;
  onClear: () => void;
}

export function Cart({ items, onUpdateQuantity, onRemove, onClear }: CartProps) {
  if (items.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <Empty description="Cart is empty" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Cart ({items.length})</h3>
        <button
          onClick={onClear}
          className="text-red-500 hover:text-red-700 text-sm"
        >
          Clear All
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {items.map((item) => (
          <CartItem
            key={item.inventory_id}
            item={item}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  );
}

