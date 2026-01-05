import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PublicRoute } from "@/components/PublicRoute";
import { MainLayout } from "@/layouts/MainLayout";
import { Login } from "@/pages/Login";
import { Dashboard } from "@/pages/Dashboard";
import { Users } from "@/pages/Users";
import { Roles } from "@/pages/Roles";
import { Inventory } from "@/pages/Inventory";
import { Brands } from "@/pages/Brands";
import { Stores } from "@/pages/Stores";
import { Suppliers } from "@/pages/Suppliers";
import { ItemGroups } from "@/pages/ItemGroups";
import { Customers } from "@/pages/Customers";
import { RolePermissions } from "@/features/roles/pages/RolePermissions";
import { CreateUser } from "@/features/users/pages/CreateUser";
import { EditUser } from "@/features/users/pages/EditUser";
import { CreateBrand } from "@/features/brands/pages/CreateBrand";
import { EditBrand } from "@/features/brands/pages/EditBrand";
import { CreateStore } from "@/features/stores/pages/CreateStore";
import { EditStore } from "@/features/stores/pages/EditStore";
import { CreateSupplier } from "@/features/suppliers/pages/CreateSupplier";
import { EditSupplier } from "@/features/suppliers/pages/EditSupplier";
import { CreateItemGroup } from "@/features/item-groups/pages/CreateItemGroup";
import { EditItemGroup } from "@/features/item-groups/pages/EditItemGroup";
import { CreateCustomer } from "@/features/customers/pages/CreateCustomer";
import { EditCustomer } from "@/features/customers/pages/EditCustomer";
import { CreateInventoryItem } from "@/features/inventory/pages/CreateInventoryItem";
import { EditInventoryItem } from "@/features/inventory/pages/EditInventoryItem";
import { POS } from "@/pages/POS";
import { Settings } from "@/pages/Settings";
import { Unauthorized } from "@/pages/Unauthorized";
import { SalesList } from "@/features/pos/pages/SalesList";
import { SaleDetail } from "@/features/pos/pages/SaleDetail";
import { SalesStatistics } from "@/features/pos/pages/SalesStatistics";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <Dashboard />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <Dashboard />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/users",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <Users />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/users/create",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <CreateUser />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/users/:id/edit",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <EditUser />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/inventory",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <Inventory />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/inventory/create",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <CreateInventoryItem />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/inventory/:id/edit",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <EditInventoryItem />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/brands",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <Brands />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/brands/create",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <CreateBrand />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/brands/:id/edit",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <EditBrand />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/stores",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <Stores />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/stores/create",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <CreateStore />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/stores/:id/edit",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <EditStore />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/suppliers",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <Suppliers />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/suppliers/create",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <CreateSupplier />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/suppliers/:id/edit",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <EditSupplier />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/item-groups",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <ItemGroups />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/item-groups/create",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <CreateItemGroup />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/item-groups/:id/edit",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <EditItemGroup />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/customers",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <Customers />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/customers/create",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <CreateCustomer />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/customers/:id/edit",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <EditCustomer />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/pos",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <POS />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/pos/sales",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <SalesList />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/pos/sales/:id",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <SaleDetail />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/pos/statistics",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <SalesStatistics />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <Settings />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/roles",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <Roles />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/roles/:id/permissions",
    element: (
      <ProtectedRoute>
        <MainLayout>
          <RolePermissions />
        </MainLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/unauthorized",
    element: (
      <MainLayout>
        <Unauthorized />
      </MainLayout>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/users" replace />,
  },
]);
