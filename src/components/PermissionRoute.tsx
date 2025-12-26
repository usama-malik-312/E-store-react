import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { hasPermission } from '@/utils/permissions';
import { Spin } from 'antd';

interface PermissionRouteProps {
  children: ReactNode;
  permission: string;
}

export const PermissionRoute = ({ children, permission }: PermissionRouteProps) => {
  const { isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  if (!hasPermission(permission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

