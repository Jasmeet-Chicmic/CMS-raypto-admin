"use client";

import { Eye, Menu, RotateCcw } from "lucide-react";
import { StylesConfig } from "react-select";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { toast } from "react-toastify";
import { updateGameConfigAction } from "@/api/gameConfig";
import Pagination from "@/components/atoms/Pagination";
import SearchToolbar from "@/components/atoms/SearchToolbar";
import Select from "@/components/atoms/Select";
import Table, { TableColumn } from "@/components/atoms/Table";
import FilterSidebar from "@/components/molecules/FilterSidebar";
import CustomModal from "@/components/molecules/CustomModal/CustomModal";
import {
  CURRENCY_TYPE,
  CURRENCY_TYPE_NAMES,
  THEME_TYPE,
} from "@/shared/constants";
import { useTheme } from "next-themes";
import { ROUTES } from "@/shared/routes";
import { ResponseType, SORT_DIRECTION } from "@/shared/types";
import { formatCurrency } from "@/shared/utils";
import type { GameConfig } from "./page";

const GameConfigTable = ({
  data,
  searchString,
}: {
  data: ResponseType & { data: { data: GameConfig[]; count: number } };
  searchString: string;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === THEME_TYPE.DARK;

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortKey, setSortKey] = useState("");
  const [sortDirection, setSortDirection] = useState<SORT_DIRECTION>(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedBetLimitItem, setSelectedBetLimitItem] =
    useState<GameConfig | null>(null);

  const CURRENCY_OPTIONS = Object.entries(CURRENCY_TYPE)
    .filter((entry): entry is [string, number] => typeof entry[1] === "number")
    .map(([key, value]) => ({
      label: CURRENCY_TYPE_NAMES[value] || key,
      value: value,
    }));

  useEffect(() => {
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

    router.push(`?${newParams.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, sortKey, sortDirection]);

  const handleStatusUpdate = async (
    id: string,
    updates: { isEnabled?: boolean; isMaintenance?: boolean },
  ) => {
    try {
      const res = await updateGameConfigAction({
        gameConfigId: id,
        ...updates,
      });

      if (res.status) {
        toast.success(res.message || "Status updated successfully");
        router.refresh();
      } else {
        toast.error(res.message || "Failed to update status");
      }
    } catch {
      toast.error("An error occurred while updating status");
    }
  };

  const isEnabledOptions = [
    { value: true, label: "Enabled" },
    { value: false, label: "Disabled" },
  ];

  const isMaintenanceOptions = [
    { value: true, label: "Under Maintenance" },
    { value: false, label: "Active" },
  ];

  const getStatusStyles = (
    isPositive: boolean,
  ): StylesConfig<{ value: boolean; label: string }, false> => ({
    control: (provided) => ({
      ...provided,
      minHeight: "32px",
      height: "32px",
      fontSize: "12px",
      borderRadius: "9999px",
      backgroundColor: isPositive
        ? isDark
          ? "#064e3b"
          : "#f0fdf4"
        : isDark
          ? "#7f1d1d"
          : "#fef2f2",
      borderColor: isPositive
        ? isDark
          ? "#065f46"
          : "#bbf7d0"
        : isDark
          ? "#991b1b"
          : "#fecaca",
      boxShadow: "none",
      "&:hover": {
        borderColor: isPositive
          ? isDark
            ? "#059669"
            : "#86efac"
          : isDark
            ? "#dc2626"
            : "#fca5a5",
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "0 12px",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: isPositive
        ? isDark
          ? "#34d399"
          : "#15803d"
        : isDark
          ? "#f87171"
          : "#b91c1c",
      fontWeight: "600",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      padding: "0 8px 0 0",
      color: isPositive
        ? isDark
          ? "#34d399"
          : "#15803d"
        : isDark
          ? "#f87171"
          : "#b91c1c",
      "&:hover": {
        color: isPositive
          ? isDark
            ? "#34d399"
            : "#15803d"
          : isDark
            ? "#f87171"
            : "#b91c1c",
      },
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "12px",
      overflow: "hidden",
      border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
      backgroundColor: isDark ? "#111827" : "white",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? isPositive
          ? isDark
            ? "#064e3b"
            : "#f0fdf4"
          : isDark
            ? "#7f1d1d"
            : "#fef2f2"
        : state.isFocused
          ? isPositive
            ? isDark
              ? "#065f46"
              : "#f0fdf4"
            : isDark
              ? "#991b1b"
              : "#fef2f2"
          : "transparent",
      color:
        state.isSelected || state.isFocused
          ? isPositive
            ? isDark
              ? "#34d399"
              : "#15803d"
            : isDark
              ? "#f87171"
              : "#b91c1c"
          : isDark
            ? "#9ca3af"
            : "#374151",
      fontSize: "12px",
      cursor: "pointer",
      "&:active": {
        backgroundColor: isPositive
          ? isDark
            ? "#065f46"
            : "#dcfce7"
          : isDark
            ? "#991b1b"
            : "#fee2e2",
      },
    }),
  });

  const columns: TableColumn<GameConfig>[] = [
    {
      field: "_id",
      title: "ID",
      render: (item) => (item?._id ? `#${item._id.slice(-8)}` : ""),
    },
    {
      field: "name",
      title: "Game Name",
      sortable: true,
      sortKey: "name",
      render: (item) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {item.name}
        </span>
      ),
    },
    {
      field: "profit",
      title: "Profit",
      render: (item) => {
        const currencyParam = searchParams.get("currency");
        const currency = currencyParam ? Number(currencyParam) : 1;
        return item?.profit !== undefined ? (
          <div className="flex items-center gap-1">
            <span className="font-medium">{formatCurrency(item.profit)}</span>
            <span className="text-[0.775rem] text-[#A3AED0]">
              {CURRENCY_TYPE_NAMES[currency] || ""}
            </span>
          </div>
        ) : (
          "-"
        );
      },
      sortable: true,
      sortKey: "profit",
    },
    // {
    //   field: "type",
    //   title: "Type",
    //   sortable: true,
    //   sortKey: "type",
    //   render: (item) => (
    //     <span className="px-2 py-1 rounded-full text-[0.875] font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
    //       {GAME_TYPE_NAMES[item.type] || `Type ${item.type}`}
    //     </span>
    //   ),
    // },
    {
      field: "isEnabled",
      title: "Status",
      render: (item) => (
        <div className="w-[120px]">
          <Select
            options={isEnabledOptions}
            value={isEnabledOptions.find((opt) => opt.value === item.isEnabled)}
            onChange={(val) =>
              val && handleStatusUpdate(item._id, { isEnabled: val.value })
            }
            isSearchable={false}
            styles={getStatusStyles(item.isEnabled)}
          />
        </div>
      ),
      sortable: true,
      sortKey: "isEnabled",
    },
    {
      field: "isMaintenance",
      title: "Maintenance",
      render: (item) => (
        <div className="w-[160px]">
          <Select
            options={isMaintenanceOptions}
            value={isMaintenanceOptions.find(
              (opt) => opt.value === item.isMaintenance,
            )}
            onChange={(val) =>
              val && handleStatusUpdate(item._id, { isMaintenance: val.value })
            }
            isSearchable={false}
            styles={getStatusStyles(!item.isMaintenance)}
          />
        </div>
      ),
      sortable: true,
      sortKey: "isMaintenance",
    },
    {
      field: "amountLimit",
      title: "Bet Limits",
      render: (item) => {
        const remainingCount = item.amountLimit.length - 2;

        return (
          <div className="flex flex-nowrap gap-2 min-w-[220px]">
            {item.amountLimit.slice(0, 2).map((limit) => (
              <div
                key={`${item._id}-${limit.currency}`}
                className="flex flex-col px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700 transition-all hover:shadow-sm hover:border-[#4F46E5]/30 group min-w-[100px]"
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#4F46E5]" />
                  <span className="text-[10px] font-bold text-[#A3AED0] dark:text-gray-400 uppercase leading-none">
                    {CURRENCY_TYPE_NAMES[limit.currency] || limit.currency}
                  </span>
                </div>
                <span className="text-[14px] font-bold text-[#1B2559] dark:text-white leading-none ml-3">
                  {formatCurrency(limit.maxBetAmount)}
                </span>
              </div>
            ))}
            {remainingCount > 0 && (
              <button
                onClick={() => setSelectedBetLimitItem(item)}
                className="flex items-center justify-center px-3 py-1.5 rounded-xl border border-dashed border-[#4F46E5]/30 dark:border-indigo-500/30 text-[12px] font-bold text-[#4F46E5] dark:text-indigo-400 bg-[#4F46E5]/5 dark:bg-indigo-500/10 hover:bg-[#4F46E5]/10 dark:hover:bg-indigo-500/20 cursor-pointer transition-all min-w-[80px]"
              >
                +{remainingCount} More
              </button>
            )}
          </div>
        );
      },
    },
    // {
    //   field: "createdAt",
    //   title: "Created At",
    //   sortable: true,
    //   sortKey: "createdAt",
    //   render: (item) => (
    //     <span className="text-[#1b2559] text-[0.875rem]">
    //       {formatDate(item.createdAt)}
    //     </span>
    //   ),
    // },
    {
      field: "",
      title: "Actions",
      render: (item) => (
        <div className="flex items-center space-x-3">
          <button
            onClick={() =>
              router.push(`${ROUTES.GAME_CONFIGS_VIEW}/${item._id}`)
            }
            className="text-gray-500 hover:text-blue-600 transition-colors"
            title="View"
          >
            <Eye size={18} />
          </button>
        </div>
      ),
      fixed: "right",
    },
  ];

  return (
    <>
      <div className="bg-white px-6 pt-7 pb-3 rounded-[20px_20px_0_0] dark:bg-gray-900 dark:border-gray-800">
        {/* Table Controls */}
        <div className="dark:border-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-[1.5rem] font-bold text-[#1B2559] dark:text-white">
                Game Configs
              </h2>
              {/* <p className="text-[14px] font-medium text-[#A3AED0] dark:text-gray-400">
                Manage game configurations and settings
              </p> */}
            </div>
            <div className="flex items-center space-x-4">
              <SearchToolbar
                initialQuery={searchString}
                placeholder="Search Game..."
              />
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
      </div>

      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Game Config Filters"
        footer={
          <button
            onClick={() => {
              router.push(pathname);
              setIsFilterOpen(false);
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
              htmlFor="status-filter"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Status
            </label>
            <Select
              inputId="status-filter"
              placeholder="Select Status"
              isClearable
              options={[
                { label: "Enabled", value: "true" },
                { label: "Disabled", value: "false" },
              ]}
              value={
                searchParams.get("isEnabled") === "true"
                  ? { label: "Enabled", value: "true" }
                  : searchParams.get("isEnabled") === "false"
                    ? { label: "Disabled", value: "false" }
                    : null
              }
              onChange={(option: { label: string; value: string } | null) => {
                const newParams = new URLSearchParams(searchParams.toString());
                if (option) {
                  newParams.set("isEnabled", option.value);
                } else {
                  newParams.delete("isEnabled");
                }
                router.push(`?${newParams.toString()}`);
              }}
            />
          </div>

          <div>
            <label
              htmlFor="maintenance-filter"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Maintenance
            </label>
            <Select
              inputId="maintenance-filter"
              placeholder="Select Maintenance Status"
              isClearable
              options={[
                { label: "Under Maintenance", value: "true" },
                { label: "Active", value: "false" },
              ]}
              value={
                searchParams.get("isMaintenance") === "true"
                  ? { label: "Under Maintenance", value: "true" }
                  : searchParams.get("isMaintenance") === "false"
                    ? { label: "Active", value: "false" }
                    : null
              }
              onChange={(option: { label: string; value: string } | null) => {
                const newParams = new URLSearchParams(searchParams.toString());
                if (option) {
                  newParams.set("isMaintenance", option.value);
                } else {
                  newParams.delete("isMaintenance");
                }
                router.push(`?${newParams.toString()}`);
              }}
            />
          </div>

          <div>
            <label
              htmlFor="currency-filter"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Currency
            </label>
            <Select
              inputId="currency-filter"
              placeholder="Select Currency"
              isClearable={false}
              options={CURRENCY_OPTIONS}
              value={
                CURRENCY_OPTIONS.find(
                  (opt) =>
                    opt.value.toString() ===
                    (searchParams.get("currency") || "1"),
                ) || CURRENCY_OPTIONS[0]
              }
              onChange={(option: { label: string; value: number } | null) => {
                const newParams = new URLSearchParams(searchParams.toString());
                if (option) {
                  newParams.set("currency", option.value.toString());
                } else {
                  newParams.delete("currency");
                }
                router.push(`?${newParams.toString()}`);
              }}
              classNamePrefix="react-select"
            />
          </div>
        </div>
      </FilterSidebar>

      <Table<GameConfig>
        data={data?.data?.data || []}
        columns={columns}
        keyExtractor={(item) => item._id || ""}
        handleSort={(sortKey, sortDirection) => {
          setSortKey(sortKey);
          setSortDirection(sortDirection);
        }}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
      />
      <Pagination
        totalItems={data?.data?.count ?? 0}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={(page) => setCurrentPage(page + 1)}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
        title="game configs"
      />

      {/* Bet Limits Modal */}
      <CustomModal
        isOpen={!!selectedBetLimitItem}
        onClose={() => setSelectedBetLimitItem(null)}
        size="2xl"
      >
        {selectedBetLimitItem && (
          <>
            {/* Modal Header */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-[#1B2559] dark:text-white mb-2">
                Bet Limits
              </h3>
              <p className="text-sm text-[#A3AED0] dark:text-gray-400">
                {selectedBetLimitItem.name}
              </p>
            </div>

            {/* Modal Content */}
            <div className="max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedBetLimitItem.amountLimit.map((limit) => (
                  <div
                    key={`modal-${selectedBetLimitItem._id}-${limit.currency}`}
                    className="flex flex-col px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md hover:border-[#4F46E5]/30"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-2 h-2 rounded-full bg-[#4F46E5]" />
                      <span className="text-xs font-bold text-[#A3AED0] dark:text-gray-400 uppercase">
                        {CURRENCY_TYPE_NAMES[limit.currency] || limit.currency}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-[#1B2559] dark:text-white ml-4">
                      {formatCurrency(limit.maxBetAmount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CustomModal>
    </>
  );
};

export default GameConfigTable;
