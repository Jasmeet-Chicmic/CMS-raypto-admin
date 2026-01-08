import { ApexOptions } from "apexcharts";
import { formatCurrency } from "@/shared/utils";

/**
 * Shared chart configuration for Revenue per Game charts
 * Used by both dashboard and user-specific revenue charts
 */
export const getRevenuePerGameChartOptions = (
  categories: string[],
): ApexOptions => ({
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
    formatter: (value: number) => (value ? formatCurrency(value) : ""),
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
});

/**
 * Creates series data for the revenue per game chart
 */
export const getRevenuePerGameSeries = (
  positiveRevenue: number[],
  negativeRevenue: number[],
): ApexOptions["series"] => [
  {
    name: "Revenue",
    data: positiveRevenue,
  },
  {
    name: "Loss",
    data: negativeRevenue,
  },
];
