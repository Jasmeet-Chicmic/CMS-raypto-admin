"use client";

import React, { useState, useEffect, useMemo } from "react";
import { formatCurrency } from "@/shared/utils";
import { CURRENCY_TYPE, CURRENCY_TYPE_NAMES } from "@/shared/constants";
import { fetchUserRevenuePerGameAction } from "@/api/user";
import { RevenuePerGameItem } from "@/api/dashboard";
import Select from "@/components/atoms/Select";
import DateRangeFilterDropdown from "@/components/atoms/DateRangeFilter/DateRangeFilterDropdown";
import { useRevenuePerGameData } from "@/hooks/useRevenuePerGameData";
import {
  getRevenuePerGameChartOptions,
  getRevenuePerGameSeries,
} from "@/shared/chartConfigs/revenuePerGameChartConfig";
import { ChartContentRenderer } from "@/components/molecules/Charts/ChartContentRenderer";

interface CurrencyOption {
  label: string;
  value: number;
}

interface UserRevenuePerGameChartProps {
  userId: string;
  className?: string;
}

const CURRENCY_OPTIONS: CurrencyOption[] = Object.entries(CURRENCY_TYPE)
  .filter((entry): entry is [string, number] => typeof entry[1] === "number")
  .map(([key, value]) => ({
    label: CURRENCY_TYPE_NAMES[value] || key,
    value: value,
  }));

const UserRevenuePerGameChart = ({
  userId,
  className = "",
}: UserRevenuePerGameChartProps) => {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyOption>(
    CURRENCY_OPTIONS[0],
  );
  const [dateRange, setDateRange] = useState<{ from?: string; to?: string }>(
    {},
  );
  const [data, setData] = useState<RevenuePerGameItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = {
          userId,
          currency: selectedCurrency.value,
          ...(dateRange.from && { fromDate: dateRange.from }),
          ...(dateRange.to && { toDate: dateRange.to }),
        };
        const response = await fetchUserRevenuePerGameAction(params);
        if (response?.status && response?.data?.revenuePerGame) {
          setData(response.data.revenuePerGame);
        } else {
          setData([]);
        }
      } catch (error) {
        console.error("Error fetching user revenue per game:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, selectedCurrency, dateRange]);

  // Use shared hook for data processing
  const {
    categories,
    positiveRevenue,
    negativeRevenue,
    totalRevenue,
    sortedData,
  } = useRevenuePerGameData(data);

  // Use shared chart configuration
  const chartOptions = useMemo(
    () => getRevenuePerGameChartOptions(categories),
    [categories],
  );
  const series = useMemo(
    () => getRevenuePerGameSeries(positiveRevenue, negativeRevenue),
    [positiveRevenue, negativeRevenue],
  );

  console.log("data", data);
  return (
    <div
      className={`flex-1 bg-white rounded-[20px] lg:w-1/2 p-6 dark:bg-gray-900 dark:border-gray-800 ${className}`}
    >
      <div className="flex flex-col lg:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="w-full lg:w-auto lg:flex-col">
          <h3 className="text-[1.5rem] font-bold text-[#1B2559] dark:text-white">
            Revenue per Game
          </h3>
          <p className="text-[14px] font-medium text-[#A3AED0] dark:text-gray-400">
            Total: {formatCurrency(totalRevenue)}
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4 w-auto justify-between">
          <DateRangeFilterDropdown
            useUrlParams={false}
            onApply={(from, to) => setDateRange({ from, to })}
            onClear={() => setDateRange({})}
          />
          <Select
            value={selectedCurrency}
            onChange={(option) => setSelectedCurrency(option as CurrencyOption)}
            options={CURRENCY_OPTIONS}
            isClearable={false}
            placeholder="Currency"
            classNamePrefix="react-select whitespace-nowrap"
          />
        </div>
      </div>
      <ChartContentRenderer
        loading={loading}
        hasData={sortedData.length > 0}
        series={series}
        options={chartOptions}
        emptyMessage="No data available for the selected filters"
      />
    </div>
  );
};

export default UserRevenuePerGameChart;
