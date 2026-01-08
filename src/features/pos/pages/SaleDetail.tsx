import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Space, Tag, Typography, Table, Modal, Spin } from "antd";
import { ArrowLeftOutlined, PrinterOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useSale, useCancelSale } from "../hooks";
import { formatCurrency } from "../utils/calculations";
import { Receipt } from "../components/Receipt";
import { useState } from "react";

const { Title, Text } = Typography;

export function SaleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showReceipt, setShowReceipt] = useState(false);

  const { data: sale, isLoading } = useSale(id || null);
  const cancelSaleMutation = useCancelSale();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (!sale) {
    return (
      <div>
        <Title level={2}>Sale Not Found</Title>
        <Button onClick={() => navigate("/pos/sales")}>Back to Sales</Button>
      </div>
    );
  }

  const handleCancelSale = () => {
    Modal.confirm({
      title: "Cancel Sale",
      content: `Are you sure you want to cancel sale ${sale.sale_number}? Stock will be restored to inventory.`,
      okText: "Yes, Cancel Sale",
      okType: "danger",
      onOk: () => {
        cancelSaleMutation.mutate(sale.id);
      },
    });
  };

  const itemColumns = [
    {
      title: "Item Name",
      key: "item_name",
      render: (_: any, item: any) =>
        item.item_name || item.inventory?.item_name || "Unknown Item",
    },
    {
      title: "Code",
      key: "item_code",
      render: (_: any, item: any) =>
        item.item_code || item.inventory?.item_code || "-",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Unit Price",
      dataIndex: "unit_price",
      key: "unit_price",
      render: (price: number) => formatCurrency(price),
    },
    {
      title: "Tax",
      key: "tax",
      render: (_: any, item: any) => {
        const taxAmount = item.tax_amount || 0;
        return taxAmount > 0 ? formatCurrency(taxAmount) : "-";
      },
    },
    {
      title: "Discount",
      key: "discount",
      render: (_: any, item: any) => {
        const discountAmount = item.discount_amount || 0;
        return discountAmount > 0 ? formatCurrency(discountAmount) : "-";
      },
    },
    {
      title: "Total",
      key: "total",
      render: (_: any, item: any) =>
        formatCurrency(item.total || item.unit_price * item.quantity),
    },
  ];

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <Title level={2} className="!mb-0">
          Sale Details: {sale.sale_number}
        </Title>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/pos/sales")}>
            Back
          </Button>
          <Button
            icon={<PrinterOutlined />}
            onClick={() => setShowReceipt(true)}
          >
            Print Receipt
          </Button>
          {sale.status === "completed" && (
            <Button
              danger
              icon={<CloseCircleOutlined />}
              onClick={handleCancelSale}
              loading={cancelSaleMutation.isPending}
            >
              Cancel Sale
            </Button>
          )}
        </Space>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Sale Information */}
        <Card title="Sale Information">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Text strong>Sale Number:</Text>
              <Text>{sale.sale_number}</Text>
            </div>
            <div className="flex justify-between">
              <Text strong>Date:</Text>
              <Text>{new Date(sale.sale_date).toLocaleString()}</Text>
            </div>
            <div className="flex justify-between">
              <Text strong>Store:</Text>
              <Text>{sale.store?.name || "N/A"}</Text>
            </div>
            <div className="flex justify-between">
              <Text strong>Cashier:</Text>
              <Text>
                {sale.user?.full_name || sale.user?.name || "N/A"}
              </Text>
            </div>
            <div className="flex justify-between">
              <Text strong>Customer:</Text>
              <Text>{sale.customer?.name || "Walk-in Customer"}</Text>
            </div>
            <div className="flex justify-between">
              <Text strong>Status:</Text>
              <Tag
                color={
                  sale.status === "completed"
                    ? "green"
                    : sale.status === "cancelled"
                    ? "red"
                    : "orange"
                }
              >
                {sale.status.toUpperCase()}
              </Tag>
            </div>
          </div>
        </Card>

        {/* Payment Information */}
        <Card title="Payment Information">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Text strong>Payment Method:</Text>
              <Tag>{sale.payment_method.toUpperCase()}</Tag>
            </div>
            <div className="flex justify-between">
              <Text strong>Payment Status:</Text>
              <Tag
                color={
                  sale.payment_status === "paid"
                    ? "green"
                    : sale.payment_status === "partial"
                    ? "orange"
                    : "red"
                }
              >
                {sale.payment_status.toUpperCase()}
              </Tag>
            </div>
            <div className="flex justify-between">
              <Text strong>Amount Paid:</Text>
              <Text>{formatCurrency(sale.amount_paid)}</Text>
            </div>
            {sale.payment_method !== "credit" && sale.amount_paid > sale.total_amount && (
              <div className="flex justify-between">
                <Text strong>Change:</Text>
                <Text className="text-green-600">
                  {formatCurrency(sale.amount_paid - sale.total_amount)}
                </Text>
              </div>
            )}
            {sale.payment_method === "credit" && sale.amount_due > 0 && (
              <div className="flex justify-between">
                <Text strong>Amount Due:</Text>
                <Text className="text-yellow-600">
                  {formatCurrency(sale.amount_due)}
                </Text>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Items Table */}
      <Card title="Items" className="mb-4">
        <Table
          columns={itemColumns}
          dataSource={sale.items || []}
          rowKey={(item, index) => item.id?.toString() || index.toString()}
          pagination={false}
        />
      </Card>

      {/* Totals */}
      <Card title="Totals">
        <div className="space-y-2">
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
              <Text className="text-red-500">
                -{formatCurrency(sale.discount_amount)}
              </Text>
            </div>
          )}
          <div className="flex justify-between border-t pt-2 mt-2">
            <Title level={4} className="!mb-0">
              Total:
            </Title>
            <Title level={4} className="!mb-0 text-blue-600">
              {formatCurrency(sale.total_amount)}
            </Title>
          </div>
        </div>
      </Card>

      {/* Receipt Modal */}
      <Modal
        title="Sale Receipt"
        open={showReceipt}
        onCancel={() => setShowReceipt(false)}
        footer={[
          <button
            key="print"
            onClick={() => window.print()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <PrinterOutlined className="mr-2" />
            Print Receipt
          </button>,
          <button
            key="close"
            onClick={() => setShowReceipt(false)}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 ml-2"
          >
            Close
          </button>,
        ]}
        width={600}
      >
        <Receipt sale={sale} />
      </Modal>
    </div>
  );
}



