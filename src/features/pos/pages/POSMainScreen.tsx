import { useState, useEffect, useMemo } from "react";
import { Row, Col, Card, Select, Modal, Typography, Space, Tag } from "antd";
import { ShoppingOutlined, PrinterOutlined } from "@ant-design/icons";
import { ProductSearch } from "../components/ProductSearch";
import { Cart } from "../components/Cart";
import { CheckoutPanel } from "../components/CheckoutPanel";
import { useCreateSale } from "../hooks";
import { CartItem } from "../types";
import { calculateCartTotals, formatCurrency } from "../utils/calculations";
import { useInventoryItems } from "../../inventory/hooks";
import { useCustomersDropdown } from "../../customers/hooks";
import { useStoresDropdown } from "../../stores/hooks";
import { useAuthContext } from "@/contexts/AuthContext";
import { InventoryItem } from "../../inventory/types";
import { Receipt } from "../components/Receipt";
import { InventoryFilters } from "../../inventory/types";

const { Title, Text } = Typography;

// Debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export function POSMainScreen() {
  const { user } = useAuthContext();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedStore, setSelectedStore] = useState<number | undefined>(
    user?.store_id ? Number(user.store_id) : undefined
  );
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<
    "cash" | "card" | "credit" | "mixed"
  >("cash");
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [globalDiscount, setGlobalDiscount] = useState<number>(0);
  const [completedSale, setCompletedSale] = useState<any>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  // Debounce search term
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Build filters for API call
  const inventoryFilters = useMemo<InventoryFilters>(() => {
    const filters: InventoryFilters = {};

    if (selectedStore) {
      filters.store_id = selectedStore;
    }

    if (debouncedSearch.trim()) {
      filters.search = debouncedSearch.trim();
    }

    // Handle group filter
    // null = All Items (don't send item_group_id)
    // -1 = Ungroup (items without group) - send null to backend
    // number = Specific group ID
    if (selectedGroupId !== null) {
      if (selectedGroupId === -1) {
        // For ungrouped items, send -1 which the API will convert to null
        filters.item_group_id = -1;
      } else {
        filters.item_group_id = selectedGroupId;
      }
    }

    return filters;
  }, [selectedStore, debouncedSearch, selectedGroupId]);

  // Fetch data from API with filters
  const { data: inventoryData, isLoading: inventoryLoading } =
    useInventoryItems(
      inventoryFilters,
      1,
      1000 // Get all items for POS
    );
  const { data: customers } = useCustomersDropdown();
  const { data: stores } = useStoresDropdown();
  const createSaleMutation = useCreateSale();

  const inventoryItems = inventoryData?.data || [];
  const customersList = customers || [];
  const storesList = stores || [];

  // Calculate totals
  const totals = useMemo(
    () => calculateCartTotals(cartItems, globalDiscount, amountPaid),
    [cartItems, globalDiscount, amountPaid]
  );

  // Auto-set amount paid to total when total changes (for cash payments)
  useEffect(() => {
    if (paymentMethod === "cash" && totals.total > 0 && amountPaid === 0) {
      setAmountPaid(totals.total);
    }
  }, [totals.total, paymentMethod]);

  // Handle adding item to cart
  const handleAddToCart = (item: InventoryItem) => {
    const existingItem = cartItems.find((ci) => ci.inventory_id === item.id);
    const availableStock = item.stock || 0;

    if (existingItem) {
      // Increment quantity if stock allows
      if (existingItem.quantity < availableStock) {
        setCartItems(
          cartItems.map((ci) =>
            ci.inventory_id === item.id
              ? { ...ci, quantity: ci.quantity + 1 }
              : ci
          )
        );
      }
    } else {
      // Add new item
      if (availableStock > 0) {
        setCartItems([
          ...cartItems,
          {
            inventory_id: item.id,
            quantity: 1,
            unit_price: item.selling_price || 0,
            inventory: item,
          },
        ]);
      }
    }
  };

  // Handle update quantity
  const handleUpdateQuantity = (inventoryId: number, quantity: number) => {
    const item = cartItems.find((ci) => ci.inventory_id === inventoryId);
    if (item && item.inventory) {
      const availableStock = item.inventory.stock || 0;
      if (quantity > 0 && quantity <= availableStock) {
        setCartItems(
          cartItems.map((ci) =>
            ci.inventory_id === inventoryId ? { ...ci, quantity } : ci
          )
        );
      }
    }
  };

  // Handle remove item
  const handleRemoveItem = (inventoryId: number) => {
    setCartItems(cartItems.filter((ci) => ci.inventory_id !== inventoryId));
  };

  // Handle clear cart
  const handleClearCart = () => {
    Modal.confirm({
      title: "Clear Cart",
      content: "Are you sure you want to clear all items from the cart?",
      onOk: () => {
        setCartItems([]);
        setAmountPaid(0);
        setGlobalDiscount(0);
      },
    });
  };

  // Handle complete sale
  const handleCompleteSale = async () => {
    if (!selectedStore) {
      Modal.error({ title: "Error", content: "Please select a store." });
      return;
    }

    if (cartItems.length === 0) {
      Modal.error({ title: "Error", content: "Cart is empty." });
      return;
    }

    if (!paymentMethod) {
      Modal.error({
        title: "Error",
        content: "Please select a payment method.",
      });
      return;
    }

    if (paymentMethod !== "credit" && amountPaid < totals.total) {
      Modal.error({
        title: "Error",
        content: `Amount paid (${formatCurrency(
          amountPaid
        )}) is less than total (${formatCurrency(totals.total)}).`,
      });
      return;
    }

    try {
      const saleData = {
        store_id: selectedStore,
        customer_id: selectedCustomer || null,
        items: cartItems.map((item) => ({
          inventory_id: item.inventory_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          tax_percentage: item.tax_percentage,
          discount_percentage: item.discount_percentage,
        })),
        payment_method: paymentMethod,
        amount_paid: amountPaid,
        discount_amount: globalDiscount > 0 ? globalDiscount : undefined,
      };

      const sale = await createSaleMutation.mutateAsync(saleData);
      setCompletedSale(sale);
      setShowReceipt(true);

      // Clear cart and reset
      setCartItems([]);
      setSelectedCustomer(null);
      setAmountPaid(0);
      setGlobalDiscount(0);
      setPaymentMethod("cash");
    } catch (error) {
      // Error is handled by the mutation's onError
    }
  };

  // Enrich cart items with inventory data
  const enrichedCartItems = useMemo(() => {
    return cartItems.map((item) => {
      const inventory = inventoryItems.find(
        (inv) => inv.id === item.inventory_id
      );
      return {
        ...item,
        inventory,
      };
    });
  }, [cartItems, inventoryItems]);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-4 flex justify-between items-center">
        <Title level={2} className="!mb-0">
          <ShoppingOutlined className="mr-2" />
          Point of Sale
        </Title>
        <Space>
          {storesList.length > 1 && (
            <Select
              style={{ width: 200 }}
              placeholder="Select Store"
              value={selectedStore}
              onChange={setSelectedStore}
              options={storesList.map((s) => ({ label: s.name, value: s.id }))}
            />
          )}
          <Text>{new Date().toLocaleString()}</Text>
        </Space>
      </div>

      {/* Main POS Interface */}
      <Row gutter={16} className="flex-1" style={{ minHeight: 0 }}>
        {/* Left Panel - Product Search */}
        <Col xs={24} lg={14} className="flex flex-col" style={{ minHeight: 0 }}>
          <Card
            className="flex-1 flex flex-col"
            bodyStyle={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <ProductSearch
              items={inventoryItems}
              loading={inventoryLoading}
              onSelectItem={handleAddToCart}
              selectedStoreId={selectedStore}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedGroupId={selectedGroupId}
              onGroupChange={setSelectedGroupId}
            />
          </Card>
        </Col>

        {/* Right Panel - Cart and Checkout */}
        <Col xs={24} lg={10} className="flex flex-col" style={{ minHeight: 0 }}>
          <Row gutter={[0, 16]} className="flex-1" style={{ minHeight: 0 }}>
            {/* Cart */}
            <Col
              span={24}
              className="flex flex-col"
              style={{ minHeight: 0, maxHeight: "40%" }}
            >
              <Card
                className="flex-1 flex flex-col"
                bodyStyle={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Cart
                  items={enrichedCartItems}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                  onClear={handleClearCart}
                />
              </Card>
            </Col>

            {/* Checkout Panel */}
            <Col
              span={24}
              className="flex flex-col"
              style={{ minHeight: 0, flex: 1 }}
            >
              <CheckoutPanel
                totals={totals}
                selectedCustomer={selectedCustomer}
                customers={customersList}
                paymentMethod={paymentMethod}
                amountPaid={amountPaid}
                onCustomerChange={setSelectedCustomer}
                onPaymentMethodChange={setPaymentMethod}
                onAmountPaidChange={setAmountPaid}
                onCompleteSale={handleCompleteSale}
                isProcessing={createSaleMutation.isPending}
                cartItemCount={cartItems.length}
              />
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Receipt Modal */}
      <Modal
        title="Sale Receipt"
        open={showReceipt}
        onCancel={() => setShowReceipt(false)}
        footer={[
          <button
            key="print"
            onClick={() => window.print()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <PrinterOutlined className="mr-2" />
            Print Receipt
          </button>,
          <button
            key="close"
            onClick={() => setShowReceipt(false)}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 ml-2"
          >
            Close
          </button>,
        ]}
        width={600}
      >
        {completedSale && <Receipt sale={completedSale} />}
      </Modal>
    </div>
  );
}
