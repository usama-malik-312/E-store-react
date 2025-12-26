import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PublicRoute } from '@/components/PublicRoute';
import { PermissionRoute } from '@/components/PermissionRoute';
import { MainLayout } from '@/layouts/MainLayout';
import { Login } from '@/pages/Login';
import { Dashboard } from '@/pages/Dashboard';
import { Users } from '@/pages/Users';
import { Roles } from '@/pages/Roles';
import { RolePermissions } from '@/features/roles/pages/RolePermissions';
import { Unauthorized } from '@/pages/Unauthorized';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout>
          <Dashboard />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <MainLayout>
          <Dashboard />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/users',
    element: (
      <ProtectedRoute>
        <MainLayout>
          <Users />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/roles',
    element: (
      <PermissionRoute permission="roles.read">
        <MainLayout>
          <Roles />
        </MainLayout>
      </PermissionRoute>
    ),
  },
  {
    path: '/roles/:id/permissions',
    element: (
      <PermissionRoute permission="roles.update">
        <MainLayout>
          <RolePermissions />
        </MainLayout>
      </PermissionRoute>
    ),
  },
  {
    path: '/unauthorized',
    element: (
      <MainLayout>
        <Unauthorized />
      </MainLayout>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/users" replace />,
  },
]);

