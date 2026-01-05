import { useState } from "react";
import { Card, Table, Tag, Button, Space, Typography, Modal } from "antd";
import { EyeOutlined, PrinterOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useSales, useCancelSale } from "../hooks";
import { SalesFilters, Sale } from "../types";
import { SaleFiltersComponent } from "../components/SaleFilters";
import { formatCurrency } from "../utils/calculations";
import { useStoresDropdown } from "../../stores/hooks";
import { useNavigate } from "react-router-dom";
import { Receipt } from "../components/Receipt";

const { Title } = Typography;

export function SalesList() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<SalesFilters>({});
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const { data: salesData, isLoading } = useSales(filters, page, limit);
  const { data: stores } = useStoresDropdown();
  const cancelSaleMutation = useCancelSale();

  const sales = salesData?.data || [];
  const pagination = salesData?.pagination;
  const storesList = stores || [];

  const handleViewSale = (sale: Sale) => {
    navigate(`/pos/sales/${sale.id}`);
  };

  const handlePrintReceipt = (sale: Sale) => {
    setSelectedSale(sale);
    setShowReceipt(true);
  };

  const handleCancelSale = (sale: Sale) => {
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

  const columns = [
    {
      title: "Sale #",
      dataIndex: "sale_number",
      key: "sale_number",
      render: (text: string, record: Sale) => (
        <Button
          type="link"
          onClick={() => handleViewSale(record)}
          className="p-0"
        >
          {text}
        </Button>
      ),
    },
    {
      title: "Date",
      dataIndex: "sale_date",
      key: "sale_date",
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: "Customer",
      key: "customer",
      render: (_: any, record: Sale) => record.customer?.name || "Walk-in",
    },
    {
      title: "Items",
      key: "items_count",
      render: (_: any, record: Sale) => record.items?.length || 0,
    },
    {
      title: "Total",
      dataIndex: "total_amount",
      key: "total_amount",
      render: (amount: number) => formatCurrency(amount),
    },
    {
      title: "Payment Method",
      dataIndex: "payment_method",
      key: "payment_method",
      render: (method: string) => <Tag>{method.toUpperCase()}</Tag>,
    },
    {
      title: "Payment Status",
      dataIndex: "payment_status",
      key: "payment_status",
      render: (status: string) => {
        const color =
          status === "paid" ? "green" : status === "partial" ? "orange" : "red";
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const color =
          status === "completed" ? "green" : status === "cancelled" ? "red" : "orange";
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Sale) => (
        <Space>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewSale(record)}
          >
            View
          </Button>
          <Button
            size="small"
            icon={<PrinterOutlined />}
            onClick={() => handlePrintReceipt(record)}
          >
            Print
          </Button>
          {record.status === "completed" && (
            <Button
              size="small"
              danger
              icon={<CloseCircleOutlined />}
              onClick={() => handleCancelSale(record)}
              loading={cancelSaleMutation.isPending}
            >
              Cancel
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={2} className="mb-6">
        Sales History
      </Title>

      <Card>
        <SaleFiltersComponent
          filters={filters}
          stores={storesList}
          onFilterChange={setFilters}
          onClear={() => {
            setFilters({});
            setPage(1);
          }}
        />

        <Table
          columns={columns}
          dataSource={sales}
          loading={isLoading}
          rowKey="id"
          pagination={{
            current: page,
            pageSize: limit,
            total: pagination?.total || 0,
            showSizeChanger: false,
            showTotal: (total) => `Total ${total} sales`,
            onChange: (newPage) => setPage(newPage),
          }}
        />
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
        {selectedSale && <Receipt sale={selectedSale} />}
      </Modal>
    </div>
  );
}

