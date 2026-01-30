"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import {
  CURRENCY_TYPE_NAMES,
  THEME_TYPE,
  CHART_COLORS,
} from "@/shared/constants";
import { formatCurrency } from "@/shared/utils";
import DateRangeFilterDropdown from "@/components/atoms/DateRangeFilter/DateRangeFilterDropdown";

const ReactApexCharts = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export interface TransactionStat {
  moneySpent: number;
  moneyEarned: number;
  currency: number;
}

interface TransactionStatsChartProps {
  stats: TransactionStat[];
  initialFromDate?: string;
  initialToDate?: string;
}

const TransactionStatsChart = ({
  stats,
  initialFromDate,
  initialToDate,
}: TransactionStatsChartProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { resolvedTheme } = useTheme();
  const isDark = useMemo(
    () => resolvedTheme === THEME_TYPE.DARK,
    [resolvedTheme],
  );

  const earnedColor = useMemo(
    () => (isDark ? CHART_COLORS.SECONDARY : CHART_COLORS.PRIMARY),
    [isDark],
  );
  const spentColor = CHART_COLORS.SPENT;

  // Sort stats by currency type to ensure consistent order
  const sortedStats = [...stats].sort((a, b) => a.currency - b.currency);

  // Prepare data for the chart
  const categories = sortedStats.map(
    (stat) => CURRENCY_TYPE_NAMES[stat.currency] || `Currency ${stat.currency}`,
  );

  const moneyEarnedData = sortedStats.map(
    (stat) => Math.round(stat.moneyEarned * 100) / 100,
  );
  const moneySpentData = sortedStats.map((stat) =>
    Math.abs(Math.round(stat.moneySpent * 100) / 100),
  );

  const series: ApexOptions["series"] = [
    {
      name: "Money Earned",
      data: moneyEarnedData,
    },
    {
      name: "Money Spent",
      data: moneySpentData,
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories,
      labels: {
        style: {
          colors: "#99a1af",
          fontFamily: "inherit",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#99a1af",
          fontFamily: "inherit",
        },
        formatter: (value: number) => formatCurrency(value),
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 1,
        opacityFrom: 0.8,
        opacityTo: 0.3,
        colorStops: [
          [
            {
              offset: 0,
              color: earnedColor,
              opacity: 1,
            },
            {
              offset: 100,
              color: "#ffffff",
              opacity: 0,
            },
          ],
          [
            {
              offset: 0,
              color: spentColor,
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
    colors: [earnedColor, spentColor], // green/theme for earned, red for spent
    legend: {
      position: "top",
      horizontalAlign: "right",
      labels: {
        colors: "#99a1af",
      },
      show: true,
    },
    tooltip: {
      marker: {
        show: true,
      },
      y: {
        formatter: (value: number) => formatCurrency(value),
      },
    },
    grid: {
      borderColor: "transparent",
      strokeDashArray: 4,
    },
  };

  return (
    <div className="flex-1 bg-bgwhite border border-b border-bordergray200ordercolor1 rounded-[20px]  p-6 dark:bg-darkbgprimary dark:border-darkbordercolor1">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center justify-start w-full">
          <h3 className="text-[1.5rem] font-bold text-textprimary dark:text-bgwhite w-full">
            Transaction Statistics
          </h3>
        </div>

        <div className="flex items-center justify-end">
          <DateRangeFilterDropdown
            initialFromDate={initialFromDate}
            initialToDate={initialToDate}
            useUrlParams={false}
            onApply={(fromDate, toDate) => {
              const newParams = new URLSearchParams(searchParams.toString());
              if (fromDate) newParams.set("statsFromDate", fromDate);
              else newParams.delete("statsFromDate");
              if (toDate) newParams.set("statsToDate", toDate);
              else newParams.delete("statsToDate");
              router.replace(`${pathname}?${newParams.toString()}`, {
                scroll: false,
              });
            }}
            onClear={() => {
              const newParams = new URLSearchParams(searchParams.toString());
              newParams.delete("statsFromDate");
              newParams.delete("statsToDate");
              router.replace(`${pathname}?${newParams.toString()}`, {
                scroll: false,
              });
            }}
          />
        </div>
      </div>
      {/* <div className="flex md:flex-row items-start md:items-center gap-4">
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span className="text-gray-600 dark:bordercolor1">
              Earned: {formatCurrency(totalEarned)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="text-gray-600 dark:bordercolor1">
              Spent: {formatCurrency(totalSpent)}
            </span>
          </div>
        </div>
      </div> */}
      {stats.length > 0 ? (
        <ReactApexCharts
          type="bar"
          height={400}
          series={series}
          options={options}
        />
      ) : (
        <div className="flex items-center justify-center h-[300px] text-gray-500">
          No transaction data available
        </div>
      )}
    </div>
  );
};

export default TransactionStatsChart;
