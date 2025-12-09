import { Typography, Card } from 'antd';
import { motion } from 'framer-motion';

const { Title } = Typography;

export const Users = () => {
  return (
    <div>
      <Title level={2} className="mb-6">
        Users Management
      </Title>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <p className="text-gray-500 dark:text-gray-400">
            Users listing page will be implemented here...
          </p>
        </Card>
      </motion.div>
    </div>
  );
};

