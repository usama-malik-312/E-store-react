import { InputNumber, Button, Card } from "antd";
import { MinusOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { CartItem as CartItemType } from "../types";
import { formatCurrency } from "../utils/calculations";

interface CartItemProps {
  item: CartItemType & { inventory?: { item_name?: string; item_code?: string; stock?: number } };
  onUpdateQuantity: (inventoryId: number, quantity: number) => void;
  onRemove: (inventoryId: number) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const itemName = item.inventory?.item_name || "Unknown Item";
  const itemCode = item.inventory?.item_code || "";
  const availableStock = item.inventory?.stock || 0;
  const subtotal = item.unit_price * item.quantity;
  const hasLowStock = availableStock < item.quantity;

  return (
    <Card size="small" className="mb-2">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="font-semibold text-sm">{itemName}</div>
          <div className="text-xs text-gray-500">{itemCode}</div>
          <div className="text-sm text-gray-600 mt-1">
            {formatCurrency(item.unit_price)} × {item.quantity}
          </div>
          {hasLowStock && (
            <div className="text-xs text-red-500 mt-1">
              Low stock! Available: {availableStock}
            </div>
          )}
        </div>
        <div className="text-right ml-4">
          <div className="font-bold text-lg mb-2">
            {formatCurrency(subtotal)}
          </div>
          <div className="flex gap-1 items-center">
            <Button
              size="small"
              icon={<MinusOutlined />}
              onClick={() => {
                if (item.quantity > 1) {
                  onUpdateQuantity(item.inventory_id, item.quantity - 1);
                }
              }}
            />
            <InputNumber
              size="small"
              min={1}
              max={availableStock}
              value={item.quantity}
              onChange={(value) => {
                if (value && value > 0 && value <= availableStock) {
                  onUpdateQuantity(item.inventory_id, value);
                }
              }}
              style={{ width: 60 }}
            />
            <Button
              size="small"
              icon={<PlusOutlined />}
              onClick={() => {
                if (item.quantity < availableStock) {
                  onUpdateQuantity(item.inventory_id, item.quantity + 1);
                }
              }}
              disabled={item.quantity >= availableStock}
            />
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onRemove(item.inventory_id)}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

