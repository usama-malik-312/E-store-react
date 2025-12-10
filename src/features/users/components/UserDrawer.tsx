import { Drawer } from 'antd';
import { motion } from 'framer-motion';
import { UserForm } from './UserForm';
import { User, CreateUserData, UpdateUserData } from '../types';

interface UserDrawerProps {
  open: boolean;
  onClose: () => void;
  user?: User;
  onSubmit: (data: CreateUserData | UpdateUserData) => void;
  isLoading?: boolean;
}

export const UserDrawer = ({ open, onClose, user, onSubmit, isLoading }: UserDrawerProps) => {
  const isEdit = !!user;

  const handleSubmit = (data: CreateUserData | UpdateUserData) => {
    onSubmit(data);
  };

  return (
    <Drawer
      title={isEdit ? 'Edit User' : 'Add New User'}
      placement="right"
      onClose={onClose}
      open={open}
      width={500}
      destroyOnClose
    >
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <UserForm
          user={user}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isLoading={isLoading}
          isEdit={isEdit}
        />
      </motion.div>
    </Drawer>
  );
};

