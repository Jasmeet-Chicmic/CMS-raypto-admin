import React, { useState, useEffect, useMemo } from "react";
import { formatCurrency } from "@/shared/utils";
import { CURRENCY_TYPE, CURRENCY_TYPE_NAMES } from "@/shared/constants";
import { fetchRevenuePerGameAction, RevenuePerGameItem } from "@/api/dashboard";
import Select from "@/components/atoms/Select";
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

interface RevenuePerGameChartProps {
  className?: string;
}

const CURRENCY_OPTIONS: CurrencyOption[] = Object.entries(CURRENCY_TYPE)
  .filter((entry): entry is [string, number] => typeof entry[1] === "number")
  .map(([key, value]) => ({
    label: CURRENCY_TYPE_NAMES[value] || key,
    value: value,
  }));

const RevenuePerGameChart = ({ className = "" }: RevenuePerGameChartProps) => {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyOption>(
    CURRENCY_OPTIONS[0],
  );
  const [data, setData] = useState<RevenuePerGameItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchRevenuePerGameAction(
          selectedCurrency.value,
        );
        if (response?.status && response?.data?.revenuePerGame) {
          setData(response.data.revenuePerGame);
        } else {
          setData([]);
        }
      } catch (error) {
        console.error("Error fetching revenue per game:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCurrency]);

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

  return (
    <div
      className={`bg-white rounded-lg dark:bg-gray-900 dark:border-gray-800 ${className}`}
    >
      <div className="flex gap-4 mb-4 justify-between flex-col xl:flex-row">
        <div>
          <h3 className="text-[1.5rem] font-bold text-[#1B2559] dark:text-white">
            Revenue per Game
          </h3>
          <p className="text-[14px] font-medium text-[#A3AED0] dark:text-gray-400">
            Total: {formatCurrency(totalRevenue)}
          </p>
        </div>
        <div className="w-48">
          <Select
            value={selectedCurrency}
            onChange={(option) => setSelectedCurrency(option as CurrencyOption)}
            options={CURRENCY_OPTIONS}
            isClearable={false}
            placeholder="Select Currency"
            classNamePrefix="react-select whitespace-nowrap"
          />
        </div>
      </div>
      <ChartContentRenderer
        loading={loading}
        hasData={sortedData.length > 0}
        series={series}
        options={chartOptions}
        emptyMessage="No data available"
      />
    </div>
  );
};

export default RevenuePerGameChart;
