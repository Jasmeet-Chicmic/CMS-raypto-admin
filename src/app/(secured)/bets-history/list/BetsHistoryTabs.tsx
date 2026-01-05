"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import SearchToolbar from "@/components/atoms/SearchToolbar";
import FilterSidebar from "@/components/molecules/FilterSidebar";
import SelectFilter from "@/components/atoms/SelectFilter";
import { Menu, RotateCcw } from "lucide-react";
import {
  CURRENCY_TYPE_NAMES,
  GAME_TYPE_NAMES,
  GAME_RESULT_NAMES,
} from "@/shared/constants";
import { ResponseType } from "@/shared/types";
import AllBetsTable from "./AllBetsTable";
import BigBetsTable from "./BigBetsTable";
import type { BetHistory } from "./page";
import DateRangeFilter from "@/components/atoms/DateRangeFilter/DateRangeFilter";

const gameTypeOptions = Object.entries(GAME_TYPE_NAMES).map(
  ([value, label]) => ({
    label,
    value: Number(value),
  }),
);

const currencyOptions = Object.entries(CURRENCY_TYPE_NAMES).map(
  ([value, label]) => ({
    label,
    value: Number(value),
  }),
);

const resultOptions = Object.entries(GAME_RESULT_NAMES).map(
  ([value, label]) => ({
    label,
    value: Number(value),
  }),
);

interface BetsHistoryTabsProps {
  allBetsData: ResponseType & { data: { data: BetHistory[]; count: number } };
  bigBetsData: ResponseType & { data: { data: BetHistory[]; count: number } };
  activeTab: string;
  searchString: string;
  initialFromDate?: string;
  initialToDate?: string;
}

const BetsHistoryTabs = ({
  allBetsData,
  bigBetsData,
  activeTab,
  searchString,
  initialFromDate,
  initialToDate,
}: BetsHistoryTabsProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleTabChange = (tabId: string) => {
    const newParams = new URLSearchParams();
    if (tabId !== "all") {
      newParams.set("tab", tabId);
    }

    // Preserve search string if it exists
    const search = searchParams.get("searchString");
    if (search) {
      newParams.set("searchString", search);
    }

    router.push(`?${newParams.toString()}`);
  };

  const tabs = [
    { id: "all", label: "All Bets" },
    { id: "big", label: "Big Bets" },
  ];

  console.log(tabs);
  return (
    <div>
      {/* Header with Tabs */}
      <div className="bg-white rounded-t-[12px] dark:bg-gray-900 dark:border-gray-800">
        <div className="p-6 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-[1.5rem] font-bold text-[#1B2559] dark:text-white">
                Bets History
              </h2>
              {/* <p className="text-[14px] font-medium text-[#A3AED0] dark:text-gray-400">
                View all game bets and their results
              </p> */}
            </div>
            <div className="flex items-center space-x-4">
              <SearchToolbar
                initialQuery={searchString}
                placeholder="Search bets..."
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

        {/* Tab Navigation */}
        <div className="flex px-6 border-b border-gray-200 dark:border-gray-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`relative px-6 py-4 text-sm font-semibold transition-all duration-200 ${
                activeTab === tab.id
                  ? "text-[#4F46E5] dark:text-white"
                  : "text-[#A3AED0] hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              }`}
            >
              <span className="relative z-10">{tab.label}</span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#4F46E5] rounded-t-full shadow-[0_-1px_10px_rgba(67,24,255,0.3)]" />
              )}
            </button>
          ))}
        </div>
      </div>

      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Bet Filters"
        footer={
          <button
            onClick={() => {
              const newParams = new URLSearchParams();
              if (activeTab !== "all") {
                newParams.set("tab", activeTab);
              }
              router.push(`?${newParams.toString()}`);
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
              htmlFor="date-range-filter"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Date Range
            </label>
            <DateRangeFilter
              id="date-range-filter"
              key={activeTab}
              initialFromDate={initialFromDate}
              initialToDate={initialToDate}
              onApply={() => setIsFilterOpen(false)}
              onClear={() => setIsFilterOpen(false)}
            />
          </div>

          <div>
            <label
              htmlFor="game-type-filter"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Game Type
            </label>
            <SelectFilter
              id="game-type-filter"
              paramName="type"
              options={gameTypeOptions}
              placeholder="Filter by Game"
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

          {activeTab === "all" && (
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
                options={resultOptions}
                placeholder="Filter by Result"
              />
            </div>
          )}
        </div>
      </FilterSidebar>

      {/* Tab Content */}
      {activeTab === "all" ? (
        <AllBetsTable data={allBetsData} />
      ) : (
        <BigBetsTable data={bigBetsData} />
      )}
    </div>
  );
};

export default BetsHistoryTabs;
