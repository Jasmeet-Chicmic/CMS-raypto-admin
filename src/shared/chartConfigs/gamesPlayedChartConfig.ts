import { ApexOptions } from "apexcharts";

// Chart constants
const PRIMARY_COLOR = "#4F46E5";
const LABEL_COLOR = "#A3AED0";
const DATA_LABEL_COLOR = "#9CA3AF";

const LABEL_STYLE = {
  colors: LABEL_COLOR,
  fontFamily: "inherit",
} as const;

/**
 * Shared chart configuration for Games Played charts
 * Used for user-specific games played visualization
 */
export const getGamesPlayedChartOptions = (
  categories: string[],
): ApexOptions => ({
  chart: {
    type: "bar",
    toolbar: { show: false },
    zoom: { enabled: false },
  },
  plotOptions: {
    bar: {
      borderRadius: 6,
      columnWidth: "50%",
      dataLabels: {
        position: "top",
      },
    },
  },
  xaxis: {
    categories,
    labels: {
      style: {
        ...LABEL_STYLE,
        fontSize: "12px",
      },
    },
    axisBorder: {
      show: true,
    },
    axisTicks: {
      show: true,
    },
  },
  yaxis: {
    labels: {
      style: LABEL_STYLE,
      formatter: (value: number) => Math.round(value).toString(),
    },
  },
  colors: [PRIMARY_COLOR],
  fill: {
    type: "gradient",
    gradient: {
      shade: "light",
      type: "vertical",
      shadeIntensity: 1,
      opacityFrom: 0.8,
      opacityTo: 0.3,
      colorStops: [
        {
          offset: 0,
          color: PRIMARY_COLOR,
          opacity: 1,
        },
        {
          offset: 100,
          color: "#ffffff",
          opacity: 0,
        },
      ],
    },
  },
  tooltip: {
    y: {
      formatter: (value: number) => value.toString(),
    },
  },
  grid: {
    borderColor: "transparent",
    strokeDashArray: 4,
  },
  dataLabels: {
    enabled: true,
    formatter: (value: number) => value.toString(),
    offsetY: -20,
    style: {
      fontSize: "12px",
      colors: [DATA_LABEL_COLOR],
    },
  },
});

/**
 * Creates series data for the games played chart
 */
export const getGamesPlayedSeries = (
  chartData: number[],
): ApexOptions["series"] => [
  {
    name: "Game Played",
    data: chartData,
  },
];
