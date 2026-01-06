import { useState, useEffect, useMemo } from "react";
import { Input, Card, Empty, Spin, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { InventoryItem } from "../../inventory/types";
import { formatCurrency } from "../utils/calculations";

interface ProductSearchProps {
  items: InventoryItem[];
  loading?: boolean;
  onSelectItem: (item: InventoryItem) => void;
  selectedStoreId?: number;
}

export function ProductSearch({ items, loading, onSelectItem, selectedStoreId }: ProductSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter items by search term and store
  const filteredItems = useMemo(() => {
    if (!items) return [];
    
    let filtered = items;
    
    // Filter by store if provided
    if (selectedStoreId) {
      filtered = filtered.filter((item) => item.store_id === selectedStoreId);
    }
    
    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.item_name?.toLowerCase().includes(term) ||
          item.item_code?.toLowerCase().includes(term) ||
          item.sku?.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  }, [items, searchTerm, selectedStoreId]);

  // Auto-focus search on mount
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // F2 or / to focus search
      if (e.key === "F2" || (e.key === "/" && document.activeElement?.tagName !== "INPUT")) {
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
      <div className="mb-4">
        <Input
          id="pos-search-input"
          size="large"
          placeholder="Search by name, code, or barcode... (F2 or /)"
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
                  <div className="text-xs text-gray-500 mb-2">{item.item_code}</div>
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


