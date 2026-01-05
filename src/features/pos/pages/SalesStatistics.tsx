import { useState } from "react";
import { Card, Row, Col, Select, DatePicker, Typography, Statistic, Space, Button } from "antd";
import { DollarOutlined, ShoppingOutlined, CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { useSalesStatistics } from "../hooks";
import { useStoresDropdown } from "../../stores/hooks";
import { formatCurrency, formatNumber } from "../utils/calculations";
import dayjs, { Dayjs } from "dayjs";

const { Title } = Typography;
const { RangePicker } = DatePicker;

export function SalesStatistics() {
  const [filters, setFilters] = useState<{
    store_id?: number;
    start_date?: string;
    end_date?: string;
  }>({});
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  const { data: statistics, isLoading } = useSalesStatistics(filters);
  const { data: stores } = useStoresDropdown();
  const storesList = stores || [];

  const handleStoreChange = (storeId: number | undefined) => {
    setFilters({ ...filters, store_id: storeId });
  };

  const handleDateRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    setDateRange(dates);
    if (dates && dates[0] && dates[1]) {
      setFilters({
        ...filters,
        start_date: dates[0].format("YYYY-MM-DD"),
        end_date: dates[1].format("YYYY-MM-DD"),
      });
    } else {
      setFilters({
        ...filters,
        start_date: undefined,
        end_date: undefined,
      });
    }
  };

  const handleClearFilters = () => {
    setFilters({});
    setDateRange(null);
  };

  const stats = statistics || {
    total_sales: 0,
    total_revenue: 0,
    total_collected: 0,
    total_outstanding: 0,
    average_sale: 0,
    sales_count: 0,
  };

  return (
    <div>
      <Title level={2} className="mb-6">
        Sales Statistics
      </Title>

      {/* Filters */}
      <Card className="mb-6">
        <Space direction="vertical" style={{ width: "100%" }} size="middle">
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8}>
              <Select
                style={{ width: "100%" }}
                placeholder="All Stores"
                allowClear
                value={filters.store_id}
                onChange={handleStoreChange}
                options={storesList.map((s) => ({ label: s.name, value: s.id }))}
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <RangePicker
                style={{ width: "100%" }}
                value={dateRange as any}
                onChange={handleDateRangeChange}
                format="YYYY-MM-DD"
              />
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Button onClick={handleClearFilters}>Clear Filters</Button>
            </Col>
          </Row>
        </Space>
      </Card>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Sales"
              value={stats.sales_count || 0}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={stats.total_revenue || 0}
              prefix={<DollarOutlined />}
              precision={2}
              formatter={(value) => formatCurrency(Number(value))}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Collected"
              value={stats.total_collected || 0}
              prefix={<CheckCircleOutlined />}
              precision={2}
              formatter={(value) => formatCurrency(Number(value))}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Outstanding"
              value={stats.total_outstanding || 0}
              prefix={<ClockCircleOutlined />}
              precision={2}
              formatter={(value) => formatCurrency(Number(value))}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Additional Statistics */}
      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Average Sale"
              value={stats.average_sale || 0}
              prefix={<DollarOutlined />}
              precision={2}
              formatter={(value) => formatCurrency(Number(value))}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

