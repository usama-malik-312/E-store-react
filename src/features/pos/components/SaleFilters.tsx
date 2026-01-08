import { Row, Col, Select, DatePicker, Input, Button, Space } from "antd";
import { SearchOutlined, ClearOutlined } from "@ant-design/icons";
import { SalesFilters } from "../types";
import { DropdownItem } from "@/types";
import dayjs, { Dayjs } from "dayjs";

const { RangePicker } = DatePicker;

interface SaleFiltersProps {
  filters: SalesFilters;
  stores: DropdownItem[];
  onFilterChange: (filters: SalesFilters) => void;
  onClear: () => void;
}

export function SaleFiltersComponent({
  filters,
  stores,
  onFilterChange,
  onClear,
}: SaleFiltersProps) {
  const handleStoreChange = (storeId: number | undefined) => {
    onFilterChange({ ...filters, store_id: storeId });
  };

  const handleStatusChange = (status: string | undefined) => {
    onFilterChange({ ...filters, status: status as any });
  };

  const handlePaymentStatusChange = (paymentStatus: string | undefined) => {
    onFilterChange({ ...filters, payment_status: paymentStatus as any });
  };

  const handleDateRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (dates && dates[0] && dates[1]) {
      onFilterChange({
        ...filters,
        start_date: dates[0].format("YYYY-MM-DD"),
        end_date: dates[1].format("YYYY-MM-DD"),
      });
    } else {
      onFilterChange({
        ...filters,
        start_date: undefined,
        end_date: undefined,
      });
    }
  };

  const handleSearchChange = (value: string) => {
    onFilterChange({ ...filters, search: value || undefined });
  };

  const dateRangeValue =
    filters.start_date && filters.end_date
      ? [dayjs(filters.start_date), dayjs(filters.end_date)]
      : null;

  return (
    <div className="mb-4">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Select
            style={{ width: "100%" }}
            placeholder="All Stores"
            allowClear
            value={filters.store_id}
            onChange={handleStoreChange}
            options={stores.map((s) => ({ label: s.name, value: s.id }))}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Select
            style={{ width: "100%" }}
            placeholder="All Status"
            allowClear
            value={filters.status}
            onChange={handleStatusChange}
            options={[
              { label: "Completed", value: "completed" },
              { label: "Cancelled", value: "cancelled" },
              { label: "Refunded", value: "refunded" },
            ]}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Select
            style={{ width: "100%" }}
            placeholder="Payment Status"
            allowClear
            value={filters.payment_status}
            onChange={handlePaymentStatusChange}
            options={[
              { label: "Paid", value: "paid" },
              { label: "Partial", value: "partial" },
              { label: "Pending", value: "pending" },
            ]}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <RangePicker
            style={{ width: "100%" }}
            value={dateRangeValue as any}
            onChange={handleDateRangeChange}
            format="YYYY-MM-DD"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Input
            placeholder="Search sale number or customer..."
            prefix={<SearchOutlined />}
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            allowClear
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Space>
            <Button icon={<ClearOutlined />} onClick={onClear}>
              Clear
            </Button>
          </Space>
        </Col>
      </Row>
    </div>
  );
}



