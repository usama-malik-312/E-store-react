import { Card, Row, Col, Statistic, Typography } from 'antd';
import {
  ShoppingOutlined,
  DollarOutlined,
  UserOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';

const { Title } = Typography;

export const Dashboard = () => {
  const stats = [
    {
      title: 'Total Sales',
      value: 125430,
      prefix: <DollarOutlined />,
      color: '#3f8600',
    },
    {
      title: 'Products',
      value: 1248,
      prefix: <AppstoreOutlined />,
      color: '#1890ff',
    },
    {
      title: 'Customers',
      value: 342,
      prefix: <UserOutlined />,
      color: '#722ed1',
    },
    {
      title: 'Orders',
      value: 89,
      prefix: <ShoppingOutlined />,
      color: '#eb2f96',
    },
  ];

  return (
    <div>
      <Title level={2} className="mb-6">
        Dashboard
      </Title>

      <Row gutter={[16, 16]}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card>
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  prefix={stat.prefix}
                  valueStyle={{ color: stat.color }}
                />
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]} className="mt-4">
        <Col xs={24} lg={16}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Card title="Recent Activity">
              <p className="text-gray-500 dark:text-gray-400">
                Recent activity will be displayed here...
              </p>
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} lg={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <Card title="Quick Actions">
              <p className="text-gray-500 dark:text-gray-400">
                Quick actions will be displayed here...
              </p>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </div>
  );
};

