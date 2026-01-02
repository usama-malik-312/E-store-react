import { Drawer } from 'antd';
import { motion } from 'framer-motion';
import { RoleForm } from './RoleForm';
import { Role, CreateRoleData, UpdateRoleData, Permission } from '../types';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from 'react-i18next';

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
  const { isRTL } = useLanguage();
  const { t } = useTranslation();

  const handleSubmit = (data: CreateRoleData | UpdateRoleData) => {
    onSubmit(data);
  };

  return (
    <Drawer
      title={isEdit ? t('roles.editRole') : t('roles.createRole')}
      placement={isRTL ? 'left' : 'right'}
      onClose={onClose}
      open={open}
      width={600}
      destroyOnClose
      zIndex={1000}
    >
      <motion.div
        initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
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
