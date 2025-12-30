import { Card, Typography } from "antd";
import { ShoppingOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

const { Title } = Typography;

export const POS = () => {
  return (
    <div>
      <Title level={2} className="mb-6">
        <ShoppingOutlined className="mr-2" />
        Point of Sale (POS)
      </Title>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <p className="text-gray-500 dark:text-gray-400">
            Point of Sale system will be displayed here...
          </p>
        </Card>
      </motion.div>
    </div>
  );
};

