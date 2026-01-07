"use client";

import { ReactNode } from "react";
import Pagination from "@/components/atoms/Pagination";
import Table, { TableColumn } from "@/components/atoms/Table";
import {
  useTableQuerySync,
  UseTableQuerySyncOptions,
} from "@/hooks/useTableQuerySync";

/**
 * Configuration for the DataTable component
 */
export interface DataTableConfig<T> {
  /**
   * Table columns configuration
   */
  columns: TableColumn<T>[];

  /**
   * Function to extract unique key from each row item
   */
  keyExtractor: (item: T) => string;

  /**
   * Title for pagination (e.g., "users", "transactions")
   */
  paginationTitle: string;

  /**
   * Optional: Custom class name for the table row
   */
  rowClassName?: (item: T) => string;

  /**
   * Optional: Hide the select column
   */
  hideSelectCol?: boolean;

  /**
   * Optional: Empty state message
   */
  emptyMessage?: string;

  /**
   * Optional: Header content to display above the table
   */
  header?: ReactNode;

  /**
   * Optional: Footer content to display below the pagination
   */
  footer?: ReactNode;

  /**
   * Optional: Configuration for the table query sync hook
   */
  queryConfig?: UseTableQuerySyncOptions;
}

/**
 * Props for the DataTable component
 */
export interface DataTableProps<T> {
  /**
   * Array of data items to display
   */
  data: T[];

  /**
   * Total count of items (for pagination)
   */
  totalCount: number;

  /**
   * Table configuration
   */
  config: DataTableConfig<T>;
}

/**
 * Generic DataTable component that handles common table structure with pagination and sorting.
 *
 * This component eliminates code duplication by providing a reusable table structure
 * that only requires column configuration and data.
 *
 * @example
 * ```tsx
 * const config: DataTableConfig<User> = {
 *   columns: [
 *     { field: "name", title: "Name", sortable: true, sortKey: "name" },
 *     { field: "email", title: "Email" },
 *   ],
 *   keyExtractor: (item) => item._id,
 *   paginationTitle: "users",
 * };
 *
 * <DataTable
 *   data={response?.data?.data || []}
 *   totalCount={response?.data?.count ?? 0}
 *   config={config}
 * />
 * ```
 */
export function DataTable<T>({
  data,
  totalCount,
  config,
}: Readonly<DataTableProps<T>>) {
  const {
    currentPage,
    pageSize,
    selectedRows,
    setSelectedRows,
    handleSort,
    handlePageChange,
    handlePageSizeChange,
  } = useTableQuerySync(config.queryConfig);

  return (
    <>
      {config.header}

      <Table<T>
        data={data}
        columns={config.columns}
        keyExtractor={config.keyExtractor}
        handleSort={handleSort}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        rowClassName={config.rowClassName}
        hideSelectCol={config.hideSelectCol}
        emptyMessage={config.emptyMessage}
      />

      <Pagination
        totalItems={totalCount}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        title={config.paginationTitle}
      />

      {config.footer}
    </>
  );
}
