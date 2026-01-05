import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { formatCurrency } from "@/shared/utils";
import {
  GAME_TYPE_NAMES,
  CURRENCY_TYPE,
  CURRENCY_TYPE_NAMES,
} from "@/shared/constants";
import { fetchRevenuePerGameAction, RevenuePerGameItem } from "@/api/dashboard";
import Select from "@/components/atoms/Select";

const ReactApexCharts = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

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

  // Sort by revenue descending
  const sortedData = useMemo(() => {
    return [...data].sort(
      (a, b) => b.grossGamingRevenue - a.grossGamingRevenue,
    );
  }, [data]);

  const categories = sortedData.map(
    (item) => GAME_TYPE_NAMES[item.gameType] || `Game ${item.gameType}`,
  );
  // Split data into positive and negative for different gradient directions
  const positiveRevenue = sortedData.map((item) =>
    item.grossGamingRevenue > 0 ? item.grossGamingRevenue : 0,
  );
  const negativeRevenue = sortedData.map((item) =>
    item.grossGamingRevenue < 0 ? item.grossGamingRevenue : 0,
  );

  // Calculate total revenue
  const totalRevenue = data.reduce(
    (sum, item) => sum + item.grossGamingRevenue,
    0,
  );

  // Bar Chart options
  const chartOptions: ApexOptions = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        horizontal: true,
        barHeight: "70%",
        distributed: false,
        dataLabels: {
          position: "center",
        },
      },
    },
    colors: ["#10B981", "#EF4444"],
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "horizontal",
        shadeIntensity: 1,
        colorStops: [
          [
            {
              offset: 0,
              color: "#ffffff",
              opacity: 0,
            },
            {
              offset: 100,
              color: "#10B981",
              opacity: 1,
            },
          ],
          [
            {
              offset: 0,
              color: "#EF4444",
              opacity: 1,
            },
            {
              offset: 100,
              color: "#ffffff",
              opacity: 0,
            },
          ],
        ],
      },
    },
    xaxis: {
      categories,
      labels: {
        style: {
          colors: "#A3AED0",
          fontFamily: "inherit",
        },
        formatter: (value: string) => formatCurrency(Number(value)),
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#A3AED0",
          fontFamily: "inherit",
          fontSize: "13px",
          fontWeight: 500,
        },
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value: number) => formatCurrency(value),
      },
    },
    grid: {
      borderColor: "transparent",
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (value: number) => (value !== 0 ? formatCurrency(value) : ""),
      style: {
        fontSize: "12px",
        colors: ["#fff"],
        fontWeight: 600,
      },
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 1,
        color: "#000",
        opacity: 0.45,
      },
    },
    legend: {
      show: false,
    },
  };

  const series: ApexOptions["series"] = [
    {
      name: "Revenue",
      data: positiveRevenue,
    },
    {
      name: "Loss",
      data: negativeRevenue,
    },
  ];

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
            // styles={{
            //   control: (provided, state) => ({
            //     ...provided,
            //     minHeight: "44px",
            //     border: `1px solid ${state.isFocused ? "#4F46E5" : "#4F46E520"}`,
            //     borderRadius: "10px",
            //     boxShadow: state.isFocused
            //       ? "0 0 0 3px rgba(67, 24, 255, 0.1)"
            //       : "none",
            //     "&:hover": {
            //       border: "1px solid #4F46E5",
            //     },
            //     cursor: "pointer",
            //     fontWeight: 500,
            //   }),
            //   option: (provided, state) => ({
            //     ...provided,
            //     backgroundColor: state.isSelected
            //       ? "#4F46E5"
            //       : state.isFocused
            //         ? "#4F46E520"
            //         : provided.backgroundColor,
            //     color: state.isSelected ? "white" : provided.color,
            //     cursor: "pointer",
            //     fontWeight: state.isSelected ? 600 : 500,
            //     "&:active": {
            //       backgroundColor: "#4F46E5",
            //     },
            //   }),
            //   singleValue: (provided) => ({
            //     ...provided,
            //     fontWeight: 600,
            //     color: "#1B2559",
            //   }),
            //   dropdownIndicator: (provided) => ({
            //     ...provided,
            //     color: "#4F46E5",
            //     "&:hover": {
            //       color: "#4F46E5",
            //     },
            //   }),
            // }}
          />
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-[350px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : sortedData.length > 0 ? (
        <ReactApexCharts
          type="bar"
          height={400}
          series={series}
          options={chartOptions}
        />
      ) : (
        <div className="flex items-center justify-center h-[350px] text-gray-500">
          No data available
        </div>
      )}
    </div>
  );
};

export default RevenuePerGameChart;
