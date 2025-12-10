import { Drawer } from 'antd';
import { motion } from 'framer-motion';
import { RoleForm } from './RoleForm';
import { Role, CreateRoleData, UpdateRoleData, Permission } from '../types';

interface RoleDrawerProps {
  open: boolean;
  onClose: () => void;
  role?: Role;
  permissions: Permission[];
  onSubmit: (data: CreateRoleData | UpdateRoleData) => void;
  isLoading?: boolean;
}

export const RoleDrawer = ({
  open,
  onClose,
  role,
  permissions,
  onSubmit,
  isLoading,
}: RoleDrawerProps) => {
  const isEdit = !!role;

  const handleSubmit = (data: CreateRoleData | UpdateRoleData) => {
    onSubmit(data);
  };

  return (
    <Drawer
      title={isEdit ? 'Edit Role' : 'Add New Role'}
      placement="right"
      onClose={onClose}
      open={open}
      width={600}
      destroyOnClose
    >
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <RoleForm
          role={role}
          permissions={permissions}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isLoading={isLoading}
          isEdit={isEdit}
        />
      </motion.div>
    </Drawer>
  );
};

