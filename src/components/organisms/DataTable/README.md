# DataTable Component

## Overview

The `DataTable` component is a generic, reusable table component that eliminates structural duplication across all table implementations. It combines the `Table`, `Pagination`, and `useTableQuerySync` hook into a single, configurable component.

## Purpose

This component was created to solve the duplication issue where every table component had the same structure:

- Import Table and Pagination components
- Use the useTableQuerySync hook
- Render Table with columns
- Render Pagination
- Pass the same props and handlers

Now, you only need to define your **column configuration** and pass your data.

## Usage

### Basic Example

```tsx
import { DataTable, DataTableConfig } from "@/components/organisms/DataTable";
import type { User } from "./types";

const UserTable = ({ data }) => {
  const config: DataTableConfig<User> = {
    columns: [
      {
        field: "name",
        title: "Name",
        sortable: true,
        sortKey: "name",
      },
      {
        field: "email",
        title: "Email",
      },
    ],
    keyExtractor: (item) => item._id,
    paginationTitle: "users",
  };

  return (
    <DataTable
      data={data?.data?.data || []}
      totalCount={data?.data?.count ?? 0}
      config={config}
    />
  );
};
```

### With Custom Sorting Defaults

```tsx
const config: DataTableConfig<Transaction> = {
  columns: [...],
  keyExtractor: (item) => item._id,
  paginationTitle: "transactions",
  queryConfig: {
    defaultSortKey: "createdAt",
    defaultSortDirection: -1, // descending
  },
};
```

### With Custom Row Styling

```tsx
const config: DataTableConfig<User> = {
  columns: [...],
  keyExtractor: (item) => item._id,
  paginationTitle: "users",
  rowClassName: (item) =>
    item.isSuspicious ? "border border-red-500" : "",
};
```

### With Header and Footer

```tsx
const config: DataTableConfig<GameConfig> = {
  columns: [...],
  keyExtractor: (item) => item._id,
  paginationTitle: "game configs",
  header: (
    <div className="bg-white px-6 pt-7 pb-3 rounded-[20px_20px_0_0]">
      <h2 className="text-[1.5rem] font-bold">Game Configs</h2>
    </div>
  ),
  footer: (
    <CustomModal>
      {/* Additional content */}
    </CustomModal>
  ),
};
```

### Without Select Column

```tsx
const config: DataTableConfig<Transaction> = {
  columns: [...],
  keyExtractor: (item) => item._id,
  paginationTitle: "transactions",
  hideSelectCol: true,
  emptyMessage: "No transactions found",
};
```

## Configuration Options

### DataTableConfig<T>

| Property          | Type                       | Required | Description                                          |
| ----------------- | -------------------------- | -------- | ---------------------------------------------------- |
| `columns`         | `TableColumn<T>[]`         | ✅       | Array of column configurations                       |
| `keyExtractor`    | `(item: T) => string`      | ✅       | Function to extract unique key from each row         |
| `paginationTitle` | `string`                   | ✅       | Title for pagination (e.g., "users", "transactions") |
| `rowClassName`    | `(item: T) => string`      | ❌       | Custom class name for table rows                     |
| `hideSelectCol`   | `boolean`                  | ❌       | Hide the select column (default: false)              |
| `emptyMessage`    | `string`                   | ❌       | Custom empty state message                           |
| `header`          | `ReactNode`                | ❌       | Content to display above the table                   |
| `footer`          | `ReactNode`                | ❌       | Content to display below pagination                  |
| `queryConfig`     | `UseTableQuerySyncOptions` | ❌       | Configuration for pagination/sorting hook            |

### queryConfig Options

| Property               | Type             | Default | Description                                 |
| ---------------------- | ---------------- | ------- | ------------------------------------------- |
| `defaultPageSize`      | `number`         | `10`    | Default number of items per page            |
| `defaultSortKey`       | `string`         | `""`    | Default field to sort by                    |
| `defaultSortDirection` | `SORT_DIRECTION` | `1`     | Default sort direction (1 = asc, -1 = desc) |

## Column Configuration

Columns use the same `TableColumn<T>` interface from the base Table component:

```tsx
interface TableColumn<T> {
  field: keyof T | "";
  title: string;
  render?: (item: T) => ReactNode;
  sortable?: boolean;
  sortKey?: string;
  fixed?: "left" | "right";
}
```

## Migration Guide

### Before (Old Pattern)

```tsx
"use client";

import Pagination from "@/components/atoms/Pagination";
import Table, { TableColumn } from "@/components/atoms/Table";
import { ResponseType } from "@/shared/types";
import { useTableQuerySync } from "@/hooks/useTableQuerySync";
import type { BetHistory } from "./page";

const BetsTable = ({ data }) => {
  const {
    currentPage,
    pageSize,
    selectedRows,
    setSelectedRows,
    handleSort,
    handlePageChange,
    handlePageSizeChange,
  } = useTableQuerySync();

  const columns: TableColumn<BetHistory>[] = [
    {
      field: "_id",
      title: "ID",
      render: (item) => `#${item._id.slice(-8)}`,
    },
    // ... more columns
  ];

  return (
    <>
      <Table<BetHistory>
        data={data?.data?.data || []}
        columns={columns}
        keyExtractor={(item) => item._id}
        handleSort={handleSort}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
      />
      <Pagination
        totalItems={data?.data?.count ?? 0}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        title="bets"
      />
    </>
  );
};
```

### After (New Pattern)

```tsx
"use client";

import { DataTable, DataTableConfig } from "@/components/organisms/DataTable";
import type { BetHistory } from "./page";

const BetsTable = ({ data }) => {
  const config: DataTableConfig<BetHistory> = {
    columns: [
      {
        field: "_id",
        title: "ID",
        render: (item) => `#${item._id.slice(-8)}`,
      },
      // ... more columns
    ],
    keyExtractor: (item) => item._id,
    paginationTitle: "bets",
  };

  return <DataTable data={data} config={config} />;
};
```

## Benefits

1. ✅ **Eliminates Boilerplate**: No need to import Table, Pagination, or useTableQuerySync
2. ✅ **Reduces Code**: ~30-40 lines of boilerplate removed per table component
3. ✅ **Consistent Structure**: All tables follow the same pattern
4. ✅ **Type Safe**: Full TypeScript support with generics
5. ✅ **Flexible**: Supports all features of the underlying components
6. ✅ **Maintainable**: Changes to table structure only need to be made once

## Code Reduction Metrics

### Per Component

- **Before**: ~100-150 lines (with boilerplate)
- **After**: ~60-100 lines (config only)
- **Reduction**: ~30-50 lines per component

### Across All Tables

- **14 table components** in the codebase
- **Estimated total reduction**: ~420-700 lines
- **Maintenance**: Changes to table structure in 1 place instead of 14

## Components Refactored

1. ✅ **AllBetsTable** - Reduced from 160 to ~130 lines
2. ✅ **BigBetsTable** - Reduced from 109 to ~80 lines
3. ⏳ **UserTable** - Pending (has additional features like filters)
4. ⏳ **GameConfigTable** - Pending (has additional features)
5. ⏳ **TransactionTable** - Pending
6. ⏳ **TransactionsTable** - Pending

## Advanced Usage

### With Complex Headers

```tsx
const config: DataTableConfig<User> = {
  columns: [...],
  keyExtractor: (item) => item._id,
  paginationTitle: "users",
  header: (
    <div className="bg-white px-6 pt-7 pb-3 rounded-[20px_20px_0_0]">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[1.5rem] font-bold">Users</h2>
        </div>
        <div className="flex items-center space-x-4">
          <SearchToolbar initialQuery={searchString} />
          <button onClick={() => setIsFilterOpen(true)}>
            Filters
          </button>
        </div>
      </div>
    </div>
  ),
};
```

### With Modals

```tsx
const [selectedItem, setSelectedItem] = useState(null);

const config: DataTableConfig<GameConfig> = {
  columns: [
    // ... columns with onClick handlers that set selectedItem
  ],
  keyExtractor: (item) => item._id,
  paginationTitle: "game configs",
  footer: (
    <CustomModal isOpen={!!selectedItem} onClose={() => setSelectedItem(null)}>
      {/* Modal content */}
    </CustomModal>
  ),
};
```

## Notes

- The component automatically handles pagination, sorting, and URL synchronization
- All features from the base Table and Pagination components are supported
- The component is fully typed with TypeScript generics
- State management is handled internally by the useTableQuerySync hook

## Future Enhancements

Potential improvements for the DataTable component:

1. **Built-in Filtering**: Add filter configuration to the config object
2. **Export Functionality**: Add built-in export to CSV/Excel
3. **Bulk Actions**: Add configuration for bulk action buttons
4. **Loading States**: Add built-in loading skeleton support
5. **Error States**: Add error boundary and error state handling
