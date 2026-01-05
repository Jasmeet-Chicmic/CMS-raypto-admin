"use client";
import React, { useState } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { SORT_DIRECTION } from "@/shared/types";

export interface TableColumn<T> {
  title: string;
  field: keyof T | ((data: T) => React.ReactNode) | "";
  render?: (data: T) => React.ReactNode;
  width?: string;
  sortable?: boolean;
  sortKey?: string;
  fixed?: boolean | "left" | "right";
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  className?: string;
  handleSort?: (sortKey: string, sortDirection: SORT_DIRECTION) => void;
  selectedRows?: string[];
  setSelectedRows?: React.Dispatch<React.SetStateAction<string[]>>;
  hideSelectCol?: boolean;
  rowClassName?: (item: T) => string;
}

function SortIcon({
  sortKey,
  currentSortKey,
  direction,
}: {
  sortKey: string;
  currentSortKey: string;
  direction: SORT_DIRECTION;
}) {
  if (sortKey !== currentSortKey) {
    return (
      <ChevronsUpDown size={14} className="text-gray-300 dark:text-gray-600" />
    );
  }
  return direction === 1 ? (
    <ChevronUp size={14} className="text-[#4F46E5]" />
  ) : (
    <ChevronDown size={14} className="text-[#4F46E5]" />
  );
}

export function Table<T>({
  columns,
  data,
  isLoading = false,
  keyExtractor,
  onRowClick,
  emptyMessage = "No data available",
  className,
  handleSort = () => {},
  selectedRows = [],
  setSelectedRows = () => {},
  hideSelectCol = false,
  rowClassName,
}: Readonly<TableProps<T>>) {
  const [sortKey, setSortKey] = useState("");
  const [sortDirection, setSortDirection] = useState<SORT_DIRECTION>(1);

  const onSortClick = (key = "", direction: SORT_DIRECTION = 1) => {
    handleSort(key, direction);
    setSortDirection(direction);
    setSortKey(key);
  };

  const hasFixedLeft = columns.some(
    (col) => col.fixed === true || col.fixed === "left",
  );

  return (
    <div
      className={
        "bg-white dark:bg-gray-900 overflow-auto custom-scrollbar relative " +
        (className || "")
      }
    >
      <table className="w-full divide-y divide-[#F4F7FE] dark:divide-gray-800">
        <thead className="bg-transparent">
          <tr>
            {!hideSelectCol && (
              <th
                className={`px-6 py-4 text-left w-[60px] ${
                  hasFixedLeft
                    ? "sticky left-0 z-20 bg-white dark:bg-gray-900 border-r border-[#F4F7FE] dark:border-gray-800"
                    : ""
                }`}
              >
                <div className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded-md border-gray-300 dark:border-gray-700 text-[#4F46E5] focus:ring-[#4F46E5] cursor-pointer transition-all"
                    checked={
                      !!selectedRows.length &&
                      !!data.length &&
                      selectedRows.length === data.length
                    }
                    onChange={() => {
                      if (selectedRows.length === data.length) {
                        setSelectedRows([]);
                      } else {
                        setSelectedRows(data.map((item) => keyExtractor(item)));
                      }
                    }}
                  />
                </div>
              </th>
            )}
            {columns?.map((column, index) => {
              const isFixedLeft =
                column.fixed === true || column.fixed === "left";
              const isFixedRight = column.fixed === "right";

              const stickyClass = isFixedLeft
                ? "sticky z-10 bg-white dark:bg-gray-900 shadow-[4px_0_8px_-3px_rgba(0,0,0,0.1)] border-r border-[#F4F7FE] dark:border-gray-800"
                : isFixedRight
                  ? "sticky z-10 bg-white dark:bg-gray-900 shadow-[-4px_0_8px_-3px_rgba(0,0,0,0.1)] border-l border-[#F4F7FE] dark:border-gray-800"
                  : "";

              return (
                <th
                  key={`${column.title + index}`}
                  scope="col"
                  onClick={() =>
                    column.sortable &&
                    onSortClick(
                      column.sortKey || "",
                      sortDirection === 1 ? -1 : 1,
                    )
                  }
                  style={
                    isFixedLeft
                      ? { left: hideSelectCol ? 0 : 60 }
                      : isFixedRight
                        ? { right: 0 }
                        : {}
                  }
                  className={`px-6 py-4 whitespace-nowrap ${
                    index === columns.length - 1 ? "text-right" : "text-left"
                  } text-[0.875rem] sm:text-[0.875rem] font-bold text-[##b2559] dark:text-gray-500 tracking-widest ${
                    column.width ? column.width : ""
                  } ${column.sortable ? "cursor-pointer select-none hover:text-[#4F46E5] transition-colors" : ""} ${stickyClass}`}
                >
                  <div
                    className={`flex ${index === columns.length - 1 ? "justify-end" : "justify-start"} items-center gap-2`}
                  >
                    {column.title}
                    {column.sortable && (
                      <SortIcon
                        sortKey={column.sortKey || ""}
                        currentSortKey={sortKey}
                        direction={sortDirection}
                      />
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#F4F7FE] dark:divide-gray-800">
          {(!data || data.length === 0) && !isLoading ? (
            <tr className="empty-row">
              <td
                colSpan={columns.length + (hideSelectCol ? 0 : 1)}
                className="px-4 py-16 text-sm text-gray-500 text-center dark:text-gray-400 font-medium"
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl opacity-50">📭</span>
                  {emptyMessage}
                </div>
              </td>
            </tr>
          ) : (
            data?.map?.((item) => (
              <tr
                key={keyExtractor(item)}
                className={
                  "group transition-all duration-200 " +
                  (onRowClick
                    ? "cursor-pointer hover:bg-gray-50/80 dark:hover:bg-gray-800/50"
                    : "hover:bg-gray-50/40 dark:hover:bg-gray-800/30") +
                  (selectedRows?.includes(keyExtractor(item))
                    ? " bg-[#4F46E5]/5 dark:bg-[#4F46E5]/10 "
                    : "") +
                  (rowClassName ? ` ${rowClassName(item)}` : "")
                }
                onClick={onRowClick ? () => onRowClick(item) : undefined}
              >
                {!hideSelectCol && (
                  <td
                    className={`px-6 py-4 text-center w-[60px] ${
                      hasFixedLeft
                        ? "sticky left-0 z-20 bg-white dark:bg-gray-900 border-r border-[#F4F7FE] dark:border-gray-800 group-hover:bg-gray-50 dark:group-hover:bg-gray-800 transition-colors"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded-md border-gray-300 dark:border-gray-700 text-[#4F46E5] focus:ring-[#4F46E5] cursor-pointer"
                        checked={!!selectedRows?.includes(keyExtractor(item))}
                        onChange={(e) => {
                          e.stopPropagation();
                          if (selectedRows?.includes(keyExtractor(item))) {
                            setSelectedRows(
                              selectedRows.filter(
                                (id) => id !== keyExtractor(item),
                              ),
                            );
                          } else {
                            setSelectedRows([
                              ...selectedRows,
                              keyExtractor(item),
                            ]);
                          }
                        }}
                      />
                    </div>
                  </td>
                )}
                {columns.map((column, index) => {
                  let value: unknown = "";
                  if (column.field) {
                    if (typeof column.field === "function") {
                      value = column.field(item);
                    } else if (column.field !== "") {
                      value = item[column.field as keyof T];
                    }
                  }

                  const isFixedLeft =
                    column.fixed === true || column.fixed === "left";
                  const isFixedRight = column.fixed === "right";

                  const stickyClass = isFixedLeft
                    ? "sticky z-10 bg-white dark:bg-gray-900 shadow-[4px_0_8px_-3px_rgba(0,0,0,0.1)] border-r border-[#F4F7FE] dark:border-gray-800 group-hover:bg-gray-50 dark:group-hover:bg-gray-800 transition-colors"
                    : isFixedRight
                      ? "sticky z-10 bg-white dark:bg-gray-900 shadow-[-4px_0_8px_-3px_rgba(0,0,0,0.1)] border-l border-[#F4F7FE] dark:border-gray-800 group-hover:bg-gray-50 dark:group-hover:bg-gray-800 transition-colors"
                      : "";

                  return (
                    <td
                      key={`${column.title + index}`}
                      style={
                        isFixedLeft
                          ? { left: hideSelectCol ? 0 : 60 }
                          : isFixedRight
                            ? { right: 0 }
                            : {}
                      }
                      className={`px-6 py-4 whitespace-nowrap text-[14px] text-[#1B2559] dark:text-white ${
                        index === columns.length - 1
                          ? "text-right"
                          : "text-left"
                      } ${stickyClass}`}
                    >
                      {column.render
                        ? column.render(item)
                        : (value as React.ReactNode)}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm transition-all">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-[#4F46E5] border-t-transparent rounded-full animate-spin shadow-lg shadow-indigo-500/20" />
            <span className="text-[12px] font-bold text-[#4F46E5] dark:text-white tracking-wider uppercase">
              Loading...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Table;
