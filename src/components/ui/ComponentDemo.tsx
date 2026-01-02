import { useState } from "react";
import { PlusOutlined, DeleteOutlined, EditOutlined, PrinterOutlined } from "@ant-design/icons";
import { Button } from "./Button";
import { InputField } from "./InputField";
import { Card } from "./Card";
import { Table, TableColumn } from "./Table";
import { Modal } from "./Modal";
import { Select } from "./Select";

/**
 * Demo component showcasing all UI components
 * This is for reference only - not meant to be used in production
 */
export const ComponentDemo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const categories = [
    { label: "Wires", value: "wires" },
    { label: "Switches", value: "switches" },
    { label: "Outlets", value: "outlets" },
    { label: "Circuit Breakers", value: "breakers" },
  ];

  const tableData = [
    { id: 1, name: "12 AWG Wire", price: 10.99, stock: 5, category: "Wires" },
    { id: 2, name: "Toggle Switch", price: 5.99, stock: 20, category: "Switches" },
    { id: 3, name: "Outlet", price: 8.99, stock: 3, category: "Outlets" },
    { id: 4, name: "Circuit Breaker", price: 25.99, stock: 15, category: "Breakers" },
  ];

  const tableColumns: TableColumn[] = [
    { header: "Product Name", accessor: "name" },
    { header: "Category", accessor: "category" },
    {
      header: "Price",
      accessor: (row) => `$${row.price.toFixed(2)}`,
    },
    {
      header: "Stock",
      accessor: (row) => (
        <span className={row.stock < 10 ? "text-red-600 font-semibold" : "text-gray-700"}>
          {row.stock} units
        </span>
      ),
      cellClassName: (row) => (row.stock < 10 ? "bg-red-50" : ""),
    },
  ];

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-bold text-gray-900">UI Components Demo</h1>

      {/* Buttons Section */}
      <Card title="Buttons" subtitle="Different button variants">
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" icon={<PlusOutlined />}>
            Add Product
          </Button>
          <Button variant="primary" icon={<PrinterOutlined />}>
            Print Invoice
          </Button>
          <Button variant="secondary" icon={<EditOutlined />}>
            Edit
          </Button>
          <Button variant="destructive" icon={<DeleteOutlined />}>
            Delete
          </Button>
          <Button variant="primary" isLoading>
            Loading...
          </Button>
        </div>
      </Card>

      {/* Input Fields Section */}
      <Card title="Input Fields" subtitle="Text inputs with validation">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputField
            label="Password"
            type="password"
            placeholder="Enter password"
            error="Password must be at least 8 characters"
          />
          <InputField
            label="Phone Number"
            type="tel"
            placeholder="+1 (555) 000-0000"
            helperText="Include country code"
          />
          <InputField
            label="Product Price"
            type="number"
            placeholder="0.00"
            helperText="Enter price in USD"
          />
        </div>
      </Card>

      {/* Select Section */}
      <Card title="Select Dropdown" subtitle="Category selection">
        <div className="max-w-md">
          <Select
            label="Product Category"
            options={categories}
            placeholder="Select a category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            helperText="Choose the product category"
          />
        </div>
      </Card>

      {/* Table Section */}
      <Card title="Data Table" subtitle="Product inventory with conditional styling">
        <Table
          columns={tableColumns}
          data={tableData}
          onRowClick={(row) => console.log("Clicked:", row)}
          emptyMessage="No products found"
        />
      </Card>

      {/* Modal Section */}
      <Card title="Modal Dialog" subtitle="Confirmation dialogs">
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          Open Delete Confirmation
        </Button>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Delete Product"
          size="md"
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  console.log("Deleted!");
                  setIsModalOpen(false);
                }}
              >
                Delete
              </Button>
            </div>
          }
        >
          <p className="text-gray-700 dark:text-gray-300">
            Are you sure you want to delete this product? This action cannot be undone.
          </p>
        </Modal>
      </Card>

      {/* Quick Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card padding="md">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">1,234</p>
            <p className="text-sm text-gray-500 mt-1">Total Products</p>
          </div>
        </Card>
        <Card padding="md">
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">$45,678</p>
            <p className="text-sm text-gray-500 mt-1">Total Revenue</p>
          </div>
        </Card>
        <Card padding="md">
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-600">23</p>
            <p className="text-sm text-gray-500 mt-1">Low Stock Items</p>
          </div>
        </Card>
      </div>
    </div>
  );
};


