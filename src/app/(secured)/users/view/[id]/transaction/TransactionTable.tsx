"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";

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
import { createSortableColumn } from "@/shared/utils";
import type { UserTransaction } from "./page";
import DateRangeFilter from "@/components/atoms/DateRangeFilter/DateRangeFilter";
import { DataTable, DataTableConfig } from "@/components/organisms/DataTable";
import { TEXT_PRIMARY_DARK } from "@/shared/styles";

import {
  BADGE_BASE,
  BADGE_GRAY,
  BADGE_GREEN,
  BADGE_PURPLE,
  BADGE_RED,
  BADGE_YELLOW,
} from "@/shared/badge";

// Helper function to create filter options from constants
const createFilterOptions = (constantsMap: Record<string, string>) =>
  Object.entries(constantsMap).map(([value, label]) => ({
    label,
    value: Number(value),
  }));

const currencyOptions = createFilterOptions(CURRENCY_TYPE_NAMES);
const statusOptions = createFilterOptions(USER_TRANSACTION_STATUS_NAMES);
const typeOptions = createFilterOptions(USER_TRANSACTION_STATICS_TYPE_NAMES);
const gameTypeOptions = createFilterOptions(GAME_TYPE_NAMES);
const gameResultOptions = createFilterOptions(GAME_RESULT_NAMES);

// Helper function to render badges
const renderBadge = (text: string, colorClass: string) => (
  <span className={`${BADGE_BASE} ${colorClass}`}>{text}</span>
);

// Helper function to get game result display
const getGameResultDisplay = (gameResult: number) => {
  switch (gameResult) {
    case GAME_RESULT.WIN:
      return { label: "Win", colorClass: BADGE_GREEN };
    case GAME_RESULT.LOSS:
      return { label: "Loss", colorClass: BADGE_RED };
    default:
      return { label: "-", colorClass: "" };
  }
};

// Helper function to get status color
const getStatusColor = (status: number): string => {
  const statusColors: Record<number, string> = {
    1: BADGE_YELLOW, // Pending
    2: BADGE_GREEN, // Completed
    3: BADGE_RED, // Failed
  };
  return statusColors[status] || BADGE_GRAY;
};

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
    setIsFilterOpen(false);
  };

  const handleFilterClear = () => {
    setIsFilterOpen(false);
  };

  const columns: TableColumn<UserTransaction>[] = [
    {
      field: "_id",
      title: "Transaction ID",
      render: (item) => (item?._id ? `#${item._id.slice(-8)}` : ""),
    },
    createSortableColumn(
      "currency",
      "Currency",
      (item) => CURRENCY_TYPE_NAMES[item.currency] || "Unknown",
    ),
    createSortableColumn("withdrawableBalance", "Amount", (item) => {
      const amount = item.withdrawableBalance;
      const isPositive = amount >= 0;
      return (
        <span className={isPositive ? "text-green-600" : "text-red-600"}>
          {isPositive ? "+" : ""}
          {amount.toFixed(2)}
        </span>
      );
    }),
    createSortableColumn("gameMultiplier", "Multiplier", (item) => (
      <span
        className={`font-medium ${(item.gameMultiplier || 0) > 0 ? "text-green-600" : "text-gray-500"}`}
      >
        {(item.gameMultiplier || 0) > 0
          ? `${item.gameMultiplier.toFixed(2)}x`
          : "-"}
      </span>
    )),
    createSortableColumn("type", "Type", (item) =>
      renderBadge(
        USER_TRANSACTION_STATICS_TYPE_NAMES[item.type] || "Unknown",
        "",
      ),
    ),
    {
      field: "gameResult",
      title: "Result",
      render: (item) => {
        const { label, colorClass } = getGameResultDisplay(item.gameResult);
        return colorClass ? (
          renderBadge(label, colorClass)
        ) : (
          <span>{label}</span>
        );
      },
    },
    createSortableColumn("gameType", "Game", (item) =>
      GAME_TYPE_NAMES[item.gameType] ? (
        renderBadge(GAME_TYPE_NAMES[item.gameType], BADGE_PURPLE)
      ) : (
        <span>-</span>
      ),
    ),
    createSortableColumn("status", "Status", (item) =>
      renderBadge(
        USER_TRANSACTION_STATUS_NAMES[item.status] || "Unknown",
        getStatusColor(item.status),
      ),
    ),
    createSortableColumn("createdAt", "Date", (item) => {
      if (!item.createdAt) return "";
      const date = new Date(item.createdAt);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }),
  ];

  const config: DataTableConfig<UserTransaction> = useMemo(
    () => ({
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
              <h3 className={`text-[1.5rem] font-bold ${TEXT_PRIMARY_DARK}`}>
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
    }),
    [
      columns,
      initialSortKey,
      initialSortDirection,
      isFilterOpen,
      initialFromDate,
      initialToDate,
      router,
    ],
  );

  return <DataTable data={data} totalCount={count} config={config} />;
};

export default TransactionTable;
