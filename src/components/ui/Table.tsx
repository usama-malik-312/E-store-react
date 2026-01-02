import { ReactNode } from "react";
import classNames from "classnames";

export interface TableColumn<T = any> {
  header: string;
  accessor: string | ((row: T) => ReactNode);
  sortable?: boolean;
  className?: string;
  headerClassName?: string;
  cellClassName?: string | ((row: T) => string);
}

export interface TableProps<T = any> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor?: (row: T, index: number) => string | number;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  className?: string;
  rowClassName?: string | ((row: T, index: number) => string);
  isLoading?: boolean;
}

export const Table = <T extends Record<string, any>>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyMessage = "No data available",
  className,
  rowClassName,
  isLoading = false,
}: TableProps<T>) => {
  const getValue = (row: T, accessor: TableColumn<T>["accessor"]) => {
    if (typeof accessor === "function") {
      return accessor(row);
    }
    return row[accessor];
  };

  const getRowKey = (row: T, index: number) => {
    if (keyExtractor) {
      return keyExtractor(row, index);
    }
    return (row.id || row._id || index) as string | number;
  };

  const getRowClassName = (row: T, index: number) => {
    const baseClass =
      "border-b border-gray-200 dark:border-gray-700 transition-colors duration-150";
    const hoverClass = onRowClick
      ? "hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
      : "";
    const customClass =
      typeof rowClassName === "function"
        ? rowClassName(row, index)
        : rowClassName || "";

    return classNames(baseClass, hoverClass, customClass);
  };

  const getCellClassName = (column: TableColumn<T>, row: T) => {
    const baseClass = "px-4 py-3 text-sm";
    const customClass =
      typeof column.cellClassName === "function"
        ? column.cellClassName(row)
        : column.cellClassName || "";

    return classNames(baseClass, column.className, customClass);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div
      className={classNames(
        "overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm",
        className
      )}
    >
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-700/50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className={classNames(
                  "px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider",
                  column.headerClassName || column.className
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((row, rowIndex) => (
            <tr
              key={getRowKey(row, rowIndex)}
              className={getRowClassName(row, rowIndex)}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className={getCellClassName(column, row)}
                >
                  {getValue(row, column.accessor)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


