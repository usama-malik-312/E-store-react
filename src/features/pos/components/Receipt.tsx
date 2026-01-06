import { Typography, Divider } from "antd";
import { Sale } from "../types";
import { formatCurrency } from "../utils/calculations";

const { Title, Text } = Typography;

interface ReceiptProps {
  sale: Sale;
}

export function Receipt({ sale }: ReceiptProps) {
  return (
    <div className="receipt-container p-6 bg-white" style={{ maxWidth: "500px", margin: "0 auto" }}>
      {/* Store Header */}
      <div className="text-center mb-4">
        <Title level={3} className="!mb-1">
          {sale.store?.name || "Store"}
        </Title>
        {sale.store?.address && (
          <Text className="text-sm text-gray-600">{sale.store.address}</Text>
        )}
        {sale.store?.phone && (
          <Text className="block text-sm text-gray-600">Phone: {sale.store.phone}</Text>
        )}
      </div>

      <Divider />

      {/* Sale Info */}
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <Text strong>Sale #:</Text>
          <Text>{sale.sale_number}</Text>
        </div>
        <div className="flex justify-between mb-1">
          <Text strong>Date:</Text>
          <Text>{new Date(sale.sale_date).toLocaleString()}</Text>
        </div>
        {sale.user && (
          <div className="flex justify-between mb-1">
            <Text strong>Cashier:</Text>
            <Text>{sale.user.full_name || sale.user.name || "N/A"}</Text>
          </div>
        )}
        <div className="flex justify-between mb-1">
          <Text strong>Customer:</Text>
          <Text>{sale.customer?.name || "Walk-in Customer"}</Text>
        </div>
      </div>

      <Divider />

      {/* Items */}
      <div className="mb-4">
        <div className="mb-2">
          <Text strong className="block mb-2">Items:</Text>
        </div>
        {sale.items && sale.items.length > 0 ? (
          <div className="space-y-2">
            {sale.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <div className="flex-1">
                  <div className="font-medium">
                    {item.item_name || item.inventory?.item_name || "Item"}
                  </div>
                  <div className="text-gray-600 text-xs">
                    {item.item_code || item.inventory?.item_code} × {item.quantity}
                  </div>
                </div>
                <div className="text-right">
                  <div>{formatCurrency(item.total || item.unit_price * item.quantity)}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Text className="text-gray-500">No items</Text>
        )}
      </div>

      <Divider />

      {/* Totals */}
      <div className="mb-4 space-y-2">
        <div className="flex justify-between">
          <Text>Subtotal:</Text>
          <Text>{formatCurrency(sale.subtotal)}</Text>
        </div>
        {sale.tax_amount > 0 && (
          <div className="flex justify-between">
            <Text>Tax:</Text>
            <Text>{formatCurrency(sale.tax_amount)}</Text>
          </div>
        )}
        {sale.discount_amount > 0 && (
          <div className="flex justify-between">
            <Text>Discount:</Text>
            <Text className="text-red-500">-{formatCurrency(sale.discount_amount)}</Text>
          </div>
        )}
        <Divider />
        <div className="flex justify-between">
          <Title level={4} className="!mb-0">
            Total:
          </Title>
          <Title level={4} className="!mb-0">
            {formatCurrency(sale.total_amount)}
          </Title>
        </div>
      </div>

      <Divider />

      {/* Payment */}
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <Text strong>Payment Method:</Text>
          <Text className="uppercase">{sale.payment_method}</Text>
        </div>
        <div className="flex justify-between mb-1">
          <Text strong>Amount Paid:</Text>
          <Text>{formatCurrency(sale.amount_paid)}</Text>
        </div>
        {sale.payment_method !== "credit" && sale.amount_paid > sale.total_amount && (
          <div className="flex justify-between mb-1">
            <Text strong>Change:</Text>
            <Text className="text-green-600">
              {formatCurrency(sale.amount_paid - sale.total_amount)}
            </Text>
          </div>
        )}
        {sale.payment_method === "credit" && sale.amount_due > 0 && (
          <div className="flex justify-between mb-1">
            <Text strong>Amount Due:</Text>
            <Text className="text-yellow-600">{formatCurrency(sale.amount_due)}</Text>
          </div>
        )}
      </div>

      <Divider />

      {/* Footer */}
      <div className="text-center mt-6">
        <Text className="text-sm text-gray-500">Thank you for your business!</Text>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .receipt-container,
          .receipt-container * {
            visibility: visible;
          }
          .receipt-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}


