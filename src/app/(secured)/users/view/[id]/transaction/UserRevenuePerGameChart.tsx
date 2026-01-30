"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useTheme } from "next-themes";
import { formatCurrency } from "@/shared/utils";
import {
  CURRENCY_TYPE,
  CURRENCY_TYPE_NAMES,
  THEME_TYPE,
  CHART_COLORS,
} from "@/shared/constants";
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
  const { resolvedTheme } = useTheme();
  const isDark = useMemo(
    () => resolvedTheme === THEME_TYPE.DARK,
    [resolvedTheme],
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
    () =>
      getRevenuePerGameChartOptions(
        categories,
        isDark ? CHART_COLORS.SECONDARY : CHART_COLORS.PRIMARY,
      ),
    [categories, isDark],
  );
  const series = useMemo(
    () => getRevenuePerGameSeries(positiveRevenue, negativeRevenue),
    [positiveRevenue, negativeRevenue],
  );

  return (
    <div
      className={`flex-1 bg-bgwhite border border-b border-bordergray200ordercolor1 rounded-[20px] lg:w-1/2 p-6 dark:bg-darkbgprimary dark:border-darkbordercolor1 ${className}`}
    >
      <div className="flex flex-col lg:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="w-full lg:w-auto lg:flex-col">
          <h3 className="text-[1.5rem] font-bold text-textprimary dark:text-bgwhite">
            Revenue per Game
          </h3>
          <p className="text-[14px] font-medium text-textparagraph dark:text-textparagraphlight">
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
