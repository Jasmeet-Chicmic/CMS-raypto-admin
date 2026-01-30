"use client";

import { ChevronDown, Eye, Menu, RotateCcw } from "lucide-react";
import CustomMenu from "@/components/atoms/Menu/Menu";
import { cn } from "@/shared/utils";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useMemo } from "react";

import { toast } from "react-toastify";
import { updateGameConfigAction } from "@/api/gameConfig";
import SearchToolbar from "@/components/atoms/SearchToolbar";
import Select from "@/components/atoms/Select";
import { TableColumn } from "@/components/atoms/Table";
import FilterSidebar from "@/components/molecules/FilterSidebar";
import CustomModal from "@/components/molecules/CustomModal/CustomModal";
import { CURRENCY_TYPE, CURRENCY_TYPE_NAMES } from "@/shared/constants";
import { ROUTES } from "@/shared/routes";
import { ResponseType } from "@/shared/types";
import { formatCurrency, createSortableColumn } from "@/shared/utils";
import { STRING } from "@/shared/strings";
import { DataTable, DataTableConfig } from "@/components/organisms/DataTable";
import type { GameConfig } from "./page";

import {
  TEXT_SECONDARY,
  TEXT_PRIMARY_DARK as TEXT_PRIMARY,
  TEXT_GRAY_WHITE as TEXT_MEDIUM,
  TEXT_SIZE_XS,
} from "@/shared/styles";

// Helper function to get filter value from search params
const getFilterValue = (
  searchParams: URLSearchParams,
  paramName: string,
  options: { label: string; value: string }[],
) => {
  const paramValue = searchParams.get(paramName);
  if (paramValue === "true") {
    return options.find((opt) => opt.value === "true") || null;
  }
  if (paramValue === "false") {
    return options.find((opt) => opt.value === "false") || null;
  }
  return null;
};

// Helper function to handle filter changes
const handleFilterChange = (
  router: ReturnType<typeof useRouter>,
  searchParams: URLSearchParams,
  paramName: string,
  value: string | number | null,
) => {
  const newParams = new URLSearchParams(searchParams.toString());
  if (value === null) {
    newParams.delete(paramName);
  } else {
    newParams.set(paramName, value.toString());
  }
  router.push(`?${newParams.toString()}`);
};

const STATUS_FILTER_OPTIONS = [
  { label: STRING.ENABLED, value: "true" },
  { label: STRING.DISABLED, value: "false" },
];

const MAINTENANCE_FILTER_OPTIONS = [
  { label: STRING.UNDER_MAINTENANCE, value: "true" },
  { label: STRING.ACTIVE, value: "false" },
];

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

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedBetLimitItem, setSelectedBetLimitItem] =
    useState<GameConfig | null>(null);

  const CURRENCY_OPTIONS = Object.entries(CURRENCY_TYPE)
    .filter((entry): entry is [string, number] => typeof entry[1] === "number")
    .map(([key, value]) => ({
      label: CURRENCY_TYPE_NAMES[value] || key,
      value: value,
    }));

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

  const columns: TableColumn<GameConfig>[] = [
    {
      field: "_id",
      title: "ID",
      render: (item) => (item?._id ? `#${item._id.slice(-8)}` : ""),
    },
    createSortableColumn("name", "Game Name", (item) => (
      <span className={TEXT_MEDIUM}>{item.name}</span>
    )),
    createSortableColumn("profit", "Profit", (item) => {
      const currencyParam = searchParams.get("currency");
      const currency = currencyParam ? Number(currencyParam) : 1;
      return item?.profit ? (
        <div className="flex items-center gap-1">
          <span className="font-medium">{formatCurrency(item.profit)}</span>
          <span className={`${TEXT_SIZE_XS} ${TEXT_SECONDARY}`}>
            {CURRENCY_TYPE_NAMES[currency] || ""}
          </span>
        </div>
      ) : (
        "-"
      );
    }),
    createSortableColumn("isEnabled", "Status", (item) => (
      <CustomMenu
        itemClassName={({ hover }) =>
          cn(
            "px-4 py-2 text-sm transition-colors cursor-pointer outline-none",
            hover
              ? "bg-primarycolor/10 text-primarycolor dark:bg-secondarycolor/10 dark:text-secondarycolor"
              : "text-labelprimary dark:text-darklabelprimary",
          )
        }
        menuButton={
          <div
            className={cn(
              `flex items-center gap-2 px-3 py-1.5 rounded-full ${TEXT_SIZE_XS} font-bold transition-all duration-200 border cursor-pointer`,
              item.isEnabled
                ? "bg-primarycolor/10 text-primarycolor border-primarycolor/20 dark:bg-secondarycolor/10 dark:text-secondarycolor dark:border-secondarycolor/10"
                : "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
            )}
          >
            <div
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                item.isEnabled
                  ? "bg-primarycolor dark:bg-secondarycolor"
                  : "bg-red-500",
              )}
            />
            {item.isEnabled ? STRING.ENABLED : STRING.DISABLED}
            <ChevronDown size={14} className="opacity-60" />
          </div>
        }
        items={[
          {
            label: (
              <div className="flex items-center gap-2 py-1">
                <div className="w-2 h-2 rounded-full bg-primarycolor dark:bg-secondarycolor" />
                <span className="font-medium">{STRING.ENABLED}</span>
              </div>
            ),
            onClick: () =>
              void handleStatusUpdate(item._id, { isEnabled: true }),
            disabled: item.isEnabled,
          },
          {
            label: (
              <div className="flex items-center gap-2 py-1">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="font-medium">{STRING.DISABLED}</span>
              </div>
            ),
            onClick: () =>
              void handleStatusUpdate(item._id, { isEnabled: false }),
            disabled: !item.isEnabled,
          },
        ]}
      />
    )),
    createSortableColumn("isMaintenance", "Maintenance", (item) => (
      <CustomMenu
        itemClassName={({ hover }) =>
          cn(
            "px-4 py-2 text-sm transition-colors cursor-pointer outline-none",
            hover
              ? "bg-primarycolor/10 text-primarycolor dark:bg-secondarycolor/10 dark:text-secondarycolor"
              : "text-labelprimary dark:text-darklabelprimary",
          )
        }
        menuButton={
          <div
            className={cn(
              `flex items-center gap-2 px-3 py-1.5 rounded-full ${TEXT_SIZE_XS} font-bold transition-all duration-200 border cursor-pointer`,
              !item.isMaintenance
                ? "bg-primarycolor/10 text-primarycolor border-primarycolor/20 dark:bg-secondarycolor/10 dark:text-secondarycolor dark:border-secondarycolor/10"
                : "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
            )}
          >
            <div
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                !item.isMaintenance
                  ? "bg-primarycolor dark:bg-secondarycolor"
                  : "bg-red-500",
              )}
            />
            {!item.isMaintenance ? STRING.ACTIVE : STRING.UNDER_MAINTENANCE}
            <ChevronDown size={14} className="opacity-60" />
          </div>
        }
        items={[
          {
            label: (
              <div className="flex items-center gap-2 py-1">
                <div className="w-2 h-2 rounded-full bg-primarycolor dark:bg-secondarycolor" />
                <span className="font-medium">{STRING.ACTIVE}</span>
              </div>
            ),
            onClick: () =>
              void handleStatusUpdate(item._id, { isMaintenance: false }),
            disabled: !item.isMaintenance,
          },
          {
            label: (
              <div className="flex items-center gap-2 py-1">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="font-medium">{STRING.UNDER_MAINTENANCE}</span>
              </div>
            ),
            onClick: () =>
              void handleStatusUpdate(item._id, { isMaintenance: true }),
            disabled: item.isMaintenance,
          },
        ]}
      />
    )),
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
                className="flex flex-col px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-darkbgprimary/40 border border-bordergray100 dark:border-labelprimary transition-all hover:shadow-sm hover:border-b border-bordergray200gpurple1/30 group min-w-[100px]"
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primarycolor" />
                  <span
                    className={`text-[10px] font-bold ${TEXT_SECONDARY} dark:bordercolor1 uppercase leading-none`}
                  >
                    {CURRENCY_TYPE_NAMES[limit.currency] || limit.currency}
                  </span>
                </div>
                <span
                  className={`text-[14px] font-bold ${TEXT_PRIMARY} leading-none ml-3`}
                >
                  {formatCurrency(limit.maxBetAmount)}
                </span>
              </div>
            ))}
            {remainingCount > 0 && (
              <button
                onClick={() => setSelectedBetLimitItem(item)}
                className="flex items-center justify-center px-3 py-1.5 rounded-xl border border-dashed border-b border-bordergray200gpurple1/30 dark:border-indigo-500/30 text-[12px] font-bold text-bgpurple1 dark:text-indigo-400 bg-primarycolor/5 dark:bg-indigo-500/10 hover:bg-primarycolor/10 dark:hover:bg-indigo-500/20 cursor-pointer transition-all min-w-[80px]"
              >
                +{remainingCount} More
              </button>
            )}
          </div>
        );
      },
    },
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

  const config: DataTableConfig<GameConfig> = useMemo(
    () => ({
      columns,
      keyExtractor: (item) => item._id || "",
      paginationTitle: "game configs",
      header: (
        <>
          <div className="bg-bgwhite px-6 pt-7 pb-3 rounded-[20px_20px_0_0] dark:bg-darkbgprimary dark:border-darkbordercolor1">
            <div className="dark:border-darkbgprimary">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div>
                  <h2 className={`text-[1.5rem] font-bold ${TEXT_PRIMARY}`}>
                    Game Configs
                  </h2>
                </div>
                <div className="flex items-center space-x-4">
                  <SearchToolbar
                    initialQuery={searchString}
                    placeholder="Search Game..."
                  />
                  <button
                    onClick={() => setIsFilterOpen(true)}
                    className="flex items-center space-x-2 px-4 py-2 transition-all duration-200 focus:outline-none focus:ring-0 font-medium bg-primarycolor text-bgwhite dark:bg-secondarycolor dark:text-black hover:bg-primaryhover dark:hover:bg-secondaryhover rounded-lg"
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
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-gray-100 dark:bg-darkbgprimary text-labelprimary dark:text-darklabelprimary rounded-xl hover:bg-gray-200 dark:hover:bg-labelprimary transition-all border bordergray200 dark:border-labelprimary font-medium"
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
                  className="block text-sm font-medium text-labelprimary dark:text-darklabelprimary mb-2"
                >
                  Status
                </label>
                <Select
                  inputId="status-filter"
                  placeholder="Select Status"
                  isClearable
                  options={STATUS_FILTER_OPTIONS}
                  value={getFilterValue(
                    searchParams,
                    "isEnabled",
                    STATUS_FILTER_OPTIONS,
                  )}
                  onChange={(option: { label: string; value: string } | null) =>
                    handleFilterChange(
                      router,
                      searchParams,
                      "isEnabled",
                      option?.value || null,
                    )
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="maintenance-filter"
                  className="block text-sm font-medium text-labelprimary dark:text-darklabelprimary mb-2"
                >
                  Maintenance
                </label>
                <Select
                  inputId="maintenance-filter"
                  placeholder="Select Maintenance Status"
                  isClearable
                  options={MAINTENANCE_FILTER_OPTIONS}
                  value={getFilterValue(
                    searchParams,
                    "isMaintenance",
                    MAINTENANCE_FILTER_OPTIONS,
                  )}
                  onChange={(option: { label: string; value: string } | null) =>
                    handleFilterChange(
                      router,
                      searchParams,
                      "isMaintenance",
                      option?.value || null,
                    )
                  }
                />
              </div>

              <div>
                <label
                  htmlFor="currency-filter"
                  className="block text-sm font-medium text-labelprimary dark:text-darklabelprimary mb-2"
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
                  onChange={(option: { label: string; value: number } | null) =>
                    handleFilterChange(
                      router,
                      searchParams,
                      "currency",
                      option?.value || null,
                    )
                  }
                  classNamePrefix="react-select"
                />
              </div>
            </div>
          </FilterSidebar>
        </>
      ),
      footer: (
        <CustomModal
          isOpen={!!selectedBetLimitItem}
          onClose={() => setSelectedBetLimitItem(null)}
          size="2xl"
        >
          {selectedBetLimitItem && (
            <>
              <div className="mb-6">
                <h3 className={`text-xl font-bold ${TEXT_PRIMARY} mb-2`}>
                  Bet Limits
                </h3>
                <p className={`text-sm ${TEXT_SECONDARY} dark:bordercolor1`}>
                  {selectedBetLimitItem.name}
                </p>
              </div>

              <div className="max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedBetLimitItem.amountLimit.map((limit) => (
                    <div
                      key={`modal-${selectedBetLimitItem._id}-${limit.currency}`}
                      className="flex flex-col px-4 py-3 rounded-xl bg-gray-50 dark:bg-darkbgprimary/40 border border-bordergray100 dark:border-labelprimary transition-all hover:shadow-md hover:border-b border-bordergray200gpurple1/30"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-2 h-2 rounded-full bg-primarycolor" />
                        <span
                          className={`text-xs font-bold ${TEXT_SECONDARY} dark:bordercolor1 uppercase`}
                        >
                          {CURRENCY_TYPE_NAMES[limit.currency] ||
                            limit.currency}
                        </span>
                      </div>
                      <span
                        className={`text-lg font-bold ${TEXT_PRIMARY} ml-4`}
                      >
                        {formatCurrency(limit.maxBetAmount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CustomModal>
      ),
    }),
    [
      columns,
      searchString,
      isFilterOpen,
      selectedBetLimitItem,
      searchParams,
      router,
      pathname,
      CURRENCY_OPTIONS,
    ],
  );

  return (
    <DataTable
      data={data?.data?.data || []}
      totalCount={data?.data?.count ?? 0}
      config={config}
    />
  );
};

export default GameConfigTable;
