"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { TableColumn } from "@/components/atoms/Table/Table";
import SelectFilter from "@/components/atoms/SelectFilter";
import FilterSidebar from "@/components/molecules/FilterSidebar";
import { Menu, RotateCcw } from "lucide-react";
import {
  CURRENCY_TYPE_NAMES,
  GAME_RESULT,
  GAME_RESULT_NAMES,
  GAME_TYPE_NAMES,
  USER_TRANSACTION_STATICS_TYPE_NAMES,
  USER_TRANSACTION_STATUS_NAMES,
} from "@/shared/constants";
import { SORT_DIRECTION } from "@/shared/types";
import type { UserTransaction } from "./page";
import DateRangeFilter from "@/components/atoms/DateRangeFilter/DateRangeFilter";
import { DataTable, DataTableConfig } from "@/components/organisms/DataTable";

const currencyOptions = Object.entries(CURRENCY_TYPE_NAMES).map(
  ([value, label]) => ({
    label,
    value: Number(value),
  }),
);

const statusOptions = Object.entries(USER_TRANSACTION_STATUS_NAMES).map(
  ([value, label]) => ({
    label,
    value: Number(value),
  }),
);

const typeOptions = Object.entries(USER_TRANSACTION_STATICS_TYPE_NAMES).map(
  ([value, label]) => ({
    label,
    value: Number(value),
  }),
);

const gameTypeOptions = Object.entries(GAME_TYPE_NAMES).map(
  ([value, label]) => ({
    label,
    value: Number(value),
  }),
);

const gameResultOptions = Object.entries(GAME_RESULT_NAMES).map(
  ([value, label]) => ({
    label,
    value: Number(value),
  }),
);

interface TransactionTableProps {
  data: UserTransaction[];
  count: number;
  initialFromDate?: string;
  initialToDate?: string;
  initialSortKey?: string;
  initialSortDirection?: SORT_DIRECTION;
}

const TransactionTable = ({
  data,
  count,
  initialFromDate,
  initialToDate,
  initialSortKey = "",
  initialSortDirection = 1,
}: TransactionTableProps) => {
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleFilterApply = () => {
    // Pagination reset is handled by the hook
  };

  const handleFilterClear = () => {
    // Pagination reset is handled by the hook
  };

  const columns: TableColumn<UserTransaction>[] = [
    {
      field: "_id",
      title: "Transaction ID",
      render: (item) => (item?._id ? `#${item._id.slice(-8)}` : ""),
    },
    {
      field: "currency",
      title: "Currency",
      render: (item) => CURRENCY_TYPE_NAMES[item.currency] || "Unknown",
      sortable: true,
      sortKey: "currency",
    },
    {
      field: "withdrawableBalance",
      title: "Amount",
      sortable: true,
      sortKey: "withdrawableBalance",
      render: (item) => {
        const amount = item.withdrawableBalance;
        const isPositive = amount >= 0;
        return (
          <span className={isPositive ? "text-green-600" : "text-red-600"}>
            {isPositive ? "+" : ""}
            {amount.toFixed(2)}
          </span>
        );
      },
    },
    {
      field: "gameMultiplier",
      title: "Multiplier",
      render: (item) => (
        <span
          className={`font-medium ${(item.gameMultiplier || 0) > 0 ? "text-green-600" : "text-gray-500"}`}
        >
          {(item.gameMultiplier || 0) > 0
            ? `${item.gameMultiplier.toFixed(2)}x`
            : "-"}
        </span>
      ),
      sortable: true,
      sortKey: "gameMultiplier",
    },
    {
      field: "type",
      title: "Type",
      render: (item) => {
        const statusName =
          USER_TRANSACTION_STATICS_TYPE_NAMES[item.type] || "Unknown";
        return (
          <span className={`px-2 py-1 rounded-full text-[0.875] font-medium`}>
            {statusName}
          </span>
        );
      },
      sortable: true,
      sortKey: "type",
    },
    {
      field: "gameResult",
      title: "Result",
      render: (item) => {
        let resultLabel = "";
        let resultClass = "";
        switch (item.gameResult) {
          case GAME_RESULT.WIN:
            resultLabel = "Win";
            resultClass =
              "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
            break;

          case GAME_RESULT.LOSS:
            resultLabel = "Loss";
            resultClass =
              "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
            break;

          default:
            resultLabel = "-";
            resultClass = "";
        }
        return (
          <span
            className={`px-2 py-1 rounded-full text-[0.875] font-medium ${
              resultClass
            }`}
          >
            {resultLabel}
          </span>
        );
      },
    },
    {
      field: "gameType",
      title: "Game",
      render: (item) => (
        <span
          className={`px-2 py-1 rounded-full text-[0.875] font-medium ${GAME_TYPE_NAMES[item.gameType] ? " bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" : ""}`}
        >
          {GAME_TYPE_NAMES[item.gameType] || `-`}
        </span>
      ),
      sortable: true,
      sortKey: "gameType",
    },
    {
      field: "status",
      title: "Status",
      render: (item) => {
        const statusName =
          USER_TRANSACTION_STATUS_NAMES[item.status] || "Unknown";
        const statusColors: Record<number, string> = {
          1: "bg-yellow-100 text-yellow-800", // Pending
          2: "bg-green-100 text-green-800", // Completed
          3: "bg-red-100 text-red-800", // Failed
        };
        return (
          <span
            className={`px-2 py-1 rounded-full text-[0.875] font-medium ${
              statusColors[item.status] || "bg-gray-100 text-gray-800"
            }`}
          >
            {statusName}
          </span>
        );
      },
      sortable: true,
      sortKey: "status",
    },
    {
      field: "createdAt",
      title: "Date",
      sortable: true,
      sortKey: "createdAt",
      render: (item) => {
        if (!item.createdAt) return "";
        const date = new Date(item.createdAt);
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      },
    },
  ];

  const config: DataTableConfig<UserTransaction> = {
    columns,
    keyExtractor: (item) => item._id,
    paginationTitle: "transactions",
    hideSelectCol: true,
    emptyMessage: "No transactions found",
    queryConfig: {
      defaultSortKey: initialSortKey,
      defaultSortDirection: initialSortDirection,
      skipFirstRender: true, // Prevent breaking GamePlayedUserChart on same page
    },
    header: (
      <>
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex flex-col lg:flex-row gap-6 justify-between items-center">
            <h3 className="text-[1.5rem] font-bold text-[#1B2559] dark:text-white">
              Transaction Statistics
            </h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-[#4F46E5] text-white rounded-[8px] hover:bg-[#3311DD] transition-all duration-200 focus:outline-none focus:ring-0 font-medium"
              >
                <Menu size={18} />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>

        <FilterSidebar
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          title="Transaction Filters"
          footer={
            <button
              onClick={() => {
                router.replace(window.location.pathname);
                setIsFilterOpen(false);
                handleFilterClear();
              }}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all border border-gray-200 dark:border-gray-700 font-medium"
            >
              <RotateCcw size={18} />
              <span>Clear All Filters</span>
            </button>
          }
        >
          <div className="space-y-6">
            <div>
              <label
                htmlFor="date-range-filter"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Date Range
              </label>
              <DateRangeFilter
                id="date-range-filter"
                initialFromDate={initialFromDate}
                initialToDate={initialToDate}
                onApply={handleFilterApply}
                onClear={handleFilterClear}
              />
            </div>

            <div>
              <label
                htmlFor="currency-filter"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Currency
              </label>
              <SelectFilter
                id="currency-filter"
                paramName="currency"
                options={currencyOptions}
                placeholder="Filter by Currency"
              />
            </div>

            <div>
              <label
                htmlFor="status-filter"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Status
              </label>
              <SelectFilter
                id="status-filter"
                paramName="status"
                options={statusOptions}
                placeholder="Filter by Status"
              />
            </div>

            <div>
              <label
                htmlFor="type-filter"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Type
              </label>
              <SelectFilter
                id="type-filter"
                paramName="type"
                options={typeOptions}
                placeholder="Filter by Type"
              />
            </div>

            <div>
              <label
                htmlFor="game-type-filter"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Game
              </label>
              <SelectFilter
                id="game-type-filter"
                paramName="gameType"
                options={gameTypeOptions}
                placeholder="Filter by Game"
              />
            </div>

            <div>
              <label
                htmlFor="result-filter"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Result
              </label>
              <SelectFilter
                id="result-filter"
                paramName="gameResult"
                options={gameResultOptions}
                placeholder="Filter by Result"
              />
            </div>
          </div>
        </FilterSidebar>
      </>
    ),
  };

  return <DataTable data={data} totalCount={count} config={config} />;
};

export default TransactionTable;
