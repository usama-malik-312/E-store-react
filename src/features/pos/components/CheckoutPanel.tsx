import { useState } from "react";
import { Card, Select, InputNumber, Button, Divider, Typography, Space, Tag } from "antd";
import { DollarOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { CartTotals } from "../types";
import { formatCurrency } from "../utils/calculations";
import { DropdownItem } from "@/types";

const { Title, Text } = Typography;

interface CheckoutPanelProps {
  totals: CartTotals;
  selectedCustomer?: number | null;
  customers: DropdownItem[];
  paymentMethod: "cash" | "card" | "credit" | "mixed";
  amountPaid: number;
  onCustomerChange: (customerId: number | null) => void;
  onPaymentMethodChange: (method: "cash" | "card" | "credit" | "mixed") => void;
  onAmountPaidChange: (amount: number) => void;
  onCompleteSale: () => void;
  isProcessing?: boolean;
  cartItemCount: number;
}

export function CheckoutPanel({
  totals,
  selectedCustomer,
  customers,
  paymentMethod,
  amountPaid,
  onCustomerChange,
  onPaymentMethodChange,
  onAmountPaidChange,
  onCompleteSale,
  isProcessing = false,
  cartItemCount,
}: CheckoutPanelProps) {
  const [showCustomerSelector, setShowCustomerSelector] = useState(false);

  const handleCompleteSale = () => {
    if (cartItemCount === 0) {
      return;
    }
    if (!paymentMethod) {
      return;
    }
    if (paymentMethod !== "credit" && amountPaid < totals.total) {
      return;
    }
    onCompleteSale();
  };

  return (
    <div className="h-full flex flex-col">
      <Card className="flex-1 flex flex-col" bodyStyle={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <Title level={4} className="mb-4">
          <ShoppingCartOutlined className="mr-2" />
          Checkout
        </Title>

        <div className="flex-1 overflow-y-auto mb-4">
          {/* Customer Selection */}
          <div className="mb-4">
            <Text strong className="block mb-2">
              Customer
            </Text>
            <Select
              style={{ width: "100%" }}
              placeholder="Walk-in Customer"
              value={selectedCustomer || undefined}
              onChange={(value) => onCustomerChange(value || null)}
              allowClear
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
              options={[
                { label: "Walk-in Customer", value: null },
                ...customers.map((c) => ({ label: c.name, value: c.id })),
              ]}
            />
          </div>

          <Divider />

          {/* Totals */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <Text>Subtotal:</Text>
              <Text>{formatCurrency(totals.subtotal)}</Text>
            </div>
            <div className="flex justify-between">
              <Text>Tax:</Text>
              <Text>{formatCurrency(totals.tax)}</Text>
            </div>
            <div className="flex justify-between">
              <Text>Discount:</Text>
              <Text className="text-red-500">-{formatCurrency(totals.discount)}</Text>
            </div>
            <Divider />
            <div className="flex justify-between">
              <Title level={4} className="!mb-0">
                Total:
              </Title>
              <Title level={4} className="!mb-0 text-blue-600">
                {formatCurrency(totals.total)}
              </Title>
            </div>
          </div>

          <Divider />

          {/* Payment Method */}
          <div className="mb-4">
            <Text strong className="block mb-2">
              Payment Method
            </Text>
            <Select
              style={{ width: "100%" }}
              value={paymentMethod}
              onChange={onPaymentMethodChange}
              options={[
                { label: "Cash", value: "cash" },
                { label: "Card", value: "card" },
                { label: "Credit", value: "credit" },
                { label: "Mixed", value: "mixed" },
              ]}
            />
          </div>

          {/* Amount Paid */}
          {paymentMethod !== "credit" && (
            <div className="mb-4">
              <Text strong className="block mb-2">
                Amount Paid
              </Text>
              <InputNumber
                style={{ width: "100%" }}
                size="large"
                prefix={<DollarOutlined />}
                value={amountPaid}
                onChange={(value) => onAmountPaidChange(value || 0)}
                min={0}
                precision={2}
                placeholder="0.00"
              />
            </div>
          )}

          {/* Change Due or Amount Due */}
          {paymentMethod === "credit" ? (
            <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded">
              <Text strong className="block mb-1">
                Amount Due:
              </Text>
              <Text className="text-lg font-bold text-yellow-600">
                {formatCurrency(totals.total)}
              </Text>
            </div>
          ) : (
            totals.changeDue > 0 && (
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded">
                <Text strong className="block mb-1">
                  Change Due:
                </Text>
                <Text className="text-lg font-bold text-green-600">
                  {formatCurrency(totals.changeDue)}
                </Text>
              </div>
            )
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button
            type="primary"
            size="large"
            block
            icon={<ShoppingCartOutlined />}
            onClick={handleCompleteSale}
            loading={isProcessing}
            disabled={cartItemCount === 0 || !paymentMethod || (paymentMethod !== "credit" && amountPaid < totals.total)}
          >
            Complete Sale
          </Button>
        </div>
      </Card>
    </div>
  );
}


