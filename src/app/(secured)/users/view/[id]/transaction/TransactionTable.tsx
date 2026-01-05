"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import Table, { TableColumn } from "@/components/atoms/Table/Table";
import Pagination from "@/components/atoms/Pagination";
// import DateRangeFilterDropdown from "@/components/atoms/DateRangeFilter/DateRangeFilterDropdown";
import SelectFilter from "@/components/atoms/SelectFilter";
// import { ExportFormat } from "@/components/atoms/ExportButton";
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
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);
  // const [isExporting, setIsExporting] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(() => {
    const skip = searchParams.get("skip");
    const limit = searchParams.get("limit") || "10";
    if (skip && limit) {
      return Math.floor(Number(skip) / Number(limit)) + 1;
    }
    return 1;
  });

  const [pageSize, setPageSize] = useState(() => {
    const limit = searchParams.get("limit");
    return limit ? Number(limit) : 10;
  });

  const [sortKey, setSortKey] = useState(
    () => searchParams.get("sortKey") || initialSortKey,
  );
  const [sortDirection, setSortDirection] = useState<SORT_DIRECTION>(() => {
    const urlSortDirection = searchParams.get("sortDirection");
    return urlSortDirection
      ? (Number(urlSortDirection) as SORT_DIRECTION)
      : initialSortDirection;
  });

  // Sync state with URL
  useEffect(() => {
    const skip = searchParams.get("skip");
    const limit = searchParams.get("limit") || "10";
    if (skip && limit) {
      setCurrentPage(Math.floor(Number(skip) / Number(limit)) + 1);
    } else {
      setCurrentPage(1);
    }

    const urlSortKey = searchParams.get("sortKey");
    if (urlSortKey) setSortKey(urlSortKey);

    const urlSortDirection = searchParams.get("sortDirection");
    if (urlSortDirection)
      setSortDirection(Number(urlSortDirection) as SORT_DIRECTION);
  }, [searchParams]);

  // Update URL when pagination or sorting changes (skip first render)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const newParams = new URLSearchParams(searchParams.toString());

    if (currentPage > 1) {
      newParams.set("skip", ((currentPage - 1) * pageSize).toString());
    } else {
      newParams.delete("skip");
    }

    if (pageSize !== 10) {
      newParams.set("limit", pageSize.toString());
    } else {
      newParams.delete("limit");
    }

    if (sortKey) {
      newParams.set("sortKey", sortKey);
      newParams.set("sortDirection", sortDirection.toString());
    } else {
      newParams.delete("sortKey");
      newParams.delete("sortDirection");
    }

    router.replace(`?${newParams.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, sortKey, sortDirection]);

  const handleSort = (newSortKey: string, newSortDirection: SORT_DIRECTION) => {
    setSortKey(newSortKey);
    setSortDirection(newSortDirection);
  };

  const handleFilterApply = () => {
    // Reset pagination when filtering
    setCurrentPage(1);
  };

  const handleFilterClear = () => {
    setCurrentPage(1);
  };

  // const handleExport = async (format: ExportFormat) => {
  //   try {
  //     // setIsExporting(true);
  //     // Dummy API call
  //     await new Promise((resolve) => setTimeout(resolve, 2000));
  //     console.log(
  //       `Exporting transactions as ${format.toUpperCase()} with params:`,
  //       searchParams.toString(),
  //     );
  //     alert(`${format.toUpperCase()} Export started! (Dummy)`);
  //   } catch (error) {
  //     console.error("Export failed:", error);
  //   } finally {
  //     setIsExporting(false);
  //   }
  // };

  const columns: TableColumn<UserTransaction>[] = [
    {
      field: "_id",
      title: "Transaction ID",
      render: (item) => (item?._id ? `#${item._id.slice(-8)}` : ""),
    },
    // {
    //   field: "type",
    //   title: "Type",
    //   render: (item) => {
    //     const typeName = USER_TRANSACTION_TYPE_NAMES[item.type] || "Unknown";
    //     const isPositive = item.withdrawableBalance >= 0;
    //     return (
    //       <span
    //         className={`px-2 py-1 rounded-full text-[0.875] font-medium ${
    //           isPositive
    //             ? "bg-green-100 text-green-800"
    //             : "bg-red-100 text-red-800"
    //         }`}
    //       >
    //         {typeName}
    //       </span>
    //     );
    //   },
    // },
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
    // {
    //   field: "nonWithdrawableBalance",
    //   title: "Non-Withdrawable",
    //   sortable: true,
    //   sortKey: "nonWithdrawableBalance",
    //   render: (item) => item.nonWithdrawableBalance.toFixed(2),
    // },
    {
      field: "type",
      title: "Type",
      render: (item) => {
        const statusName =
          USER_TRANSACTION_STATICS_TYPE_NAMES[item.type] || "Unknown";
        // const statusColors: Record<number, string> = {
        //   1: "bg-yellow-100 text-yellow-800", // Pending
        //   2: "bg-green-100 text-green-800", // Completed
        //   3: "bg-red-100 text-red-800", // Failed
        // };
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

  return (
    <>
      {/* Filters */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex flex-col lg:flex-row gap-6 justify-between items-center">
          <h3 className="text-[1.5rem] font-bold text-[#1B2559] dark:text-white">
            Transaction Statistics
          </h3>
          <div className="flex items-center gap-4">
            {/* <ExportButton onExport={handleExport} isLoading={isExporting} /> */}
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
              // Keep search if any, but clear filters.
              // Actually, TransactionTable seems to rely on URL params for everything.
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

      <Table<UserTransaction>
        data={data}
        columns={columns}
        keyExtractor={(item) => item._id}
        hideSelectCol={true}
        emptyMessage="No transactions found"
        handleSort={handleSort}
      />
      <Pagination
        totalItems={count}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={(page) => setCurrentPage(page + 1)}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
        title="transactions"
      />
    </>
  );
};

export default TransactionTable;
