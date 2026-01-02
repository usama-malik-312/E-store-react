import { Card, Typography } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

const { Title } = Typography;

export const Settings = () => {
  return (
    <div>
      <Title level={2} className="mb-6">
        <SettingOutlined className="mr-2" />
        Settings
      </Title>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <p className="text-gray-500 dark:text-gray-400">
            Application settings will be displayed here...
          </p>
        </Card>
      </motion.div>
    </div>
  );
};


