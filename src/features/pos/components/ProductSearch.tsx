import { useEffect } from "react";
import { Input, Card, Empty, Spin, Tag, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { InventoryItem } from "../../inventory/types";
import { formatCurrency } from "../utils/calculations";
import { useItemGroupsDropdown } from "../../item-groups/hooks";

interface ProductSearchProps {
  items: InventoryItem[];
  loading?: boolean;
  onSelectItem: (item: InventoryItem) => void;
  selectedStoreId?: number;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedGroupId: number | null;
  onGroupChange: (groupId: number | null) => void;
}

export function ProductSearch({
  items,
  loading,
  onSelectItem,
  selectedStoreId,
  searchTerm,
  onSearchChange,
  selectedGroupId,
  onGroupChange,
}: ProductSearchProps) {
  const { data: itemGroups = [] } = useItemGroupsDropdown();

  // Items are already filtered by backend API, so we just use them directly
  const filteredItems = items || [];

  // Auto-focus search on mount
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // F2 or / to focus search
      if (
        e.key === "F2" ||
        (e.key === "/" && document.activeElement?.tagName !== "INPUT")
      ) {
        e.preventDefault();
        const searchInput = document.getElementById("pos-search-input");
        searchInput?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* Item Groups Filter */}
      <div className="mb-4">
        <div className="mb-3">
          <div className="text-sm font-semibold text-gray-700 mb-3">
            Filter by Category
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type={selectedGroupId === null ? "primary" : "default"}
              onClick={() => onGroupChange(null)}
              size="large"
              className="font-medium"
              style={{
                minWidth: "120px",
                height: "40px",
                fontSize: "14px",
                fontWeight: selectedGroupId === null ? 600 : 400,
              }}
            >
              All Items
            </Button>
            <Button
              type={selectedGroupId === -1 ? "primary" : "default"}
              onClick={() => onGroupChange(-1)}
              size="large"
              className="font-medium"
              style={{
                minWidth: "120px",
                height: "40px",
                fontSize: "14px",
                fontWeight: selectedGroupId === -1 ? 600 : 400,
              }}
            >
              Ungroup
            </Button>

            {itemGroups.map((group) => (
              <Button
                key={group.id}
                type={selectedGroupId === group.id ? "primary" : "default"}
                onClick={() => onGroupChange(group.id)}
                size="large"
                className="font-medium"
                style={{
                  minWidth: "120px",
                  height: "40px",
                  fontSize: "14px",
                  fontWeight: selectedGroupId === group.id ? 600 : 400,
                }}
              >
                {group.group_name || ""}
              </Button>
            ))}
          </div>
        </div>
        <Input
          id="pos-search-input"
          size="large"
          placeholder="Scan barcode or search products by SKU/name"
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          allowClear
          autoFocus
          className="w-full"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : filteredItems.length === 0 ? (
          <Empty description="No items found" />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                hoverable
                className="cursor-pointer"
                onClick={() => onSelectItem(item)}
                bodyStyle={{ padding: "12px" }}
              >
                <div className="text-center">
                  <div className="font-semibold text-sm mb-1 line-clamp-2 min-h-[2.5rem]">
                    {item.item_name}
                  </div>
                  <div className="text-xs text-gray-500 mb-2">
                    {item.item_code}
                  </div>
                  <div className="text-lg font-bold text-blue-600 mb-2">
                    {formatCurrency(item.selling_price || 0)}
                  </div>
                  <div className="flex justify-center gap-2">
                    <Tag color={item.stock && item.stock > 0 ? "green" : "red"}>
                      Stock: {item.stock || 0} {item.unit || ""}
                    </Tag>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
