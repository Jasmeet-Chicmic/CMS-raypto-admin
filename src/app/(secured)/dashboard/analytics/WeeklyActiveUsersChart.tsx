"use client";

import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import DateRangeFilterDropdown from "@/components/atoms/DateRangeFilter/DateRangeFilterDropdown";

const ReactApexCharts = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export interface ActivityData {
  date: string;
  activeUsers: number;
}

interface WeeklyActiveUsersChartProps {
  activityData: ActivityData[];
  initialFromDate?: string;
  initialToDate?: string;
}

const WeeklyActiveUsersChart = ({
  activityData,
  initialFromDate = "",
  initialToDate = "",
}: WeeklyActiveUsersChartProps) => {
  // Prepare data for Activity chart (Weekly Active Users)
  const activityCategories = activityData.map((item) => {
    const date = new Date(item.date);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  });

  const activityChartData = activityData.map((item) => item.activeUsers);

  // Activity Bar Chart options
  const activityChartOptions: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: "50%",
        dataLabels: {
          position: "top",
        },
      },
    },
    xaxis: {
      categories: activityCategories,
      labels: {
        style: {
          colors: "#A3AED0",
          fontFamily: "inherit",
          fontSize: "12px",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#A3AED0",
          fontFamily: "inherit",
        },
        formatter: (value: number) => Math.round(value).toString(),
      },
    },
    colors: ["#4F46E5"],
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
            color: "#4F46E5",
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
        formatter: (value: number) => `${value} users`,
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
        colors: ["#A3AED0"],
      },
    },
  };

  const activitySeries: ApexOptions["series"] = [
    {
      name: "Active Users",
      data: activityChartData,
    },
  ];

  return (
    <div className="bg-white rounded-lg p-0 dark:bg-gray-900 dark:border-gray-800">
      <div className="flex gap-4 mb-4 justify-between flex-col xl:flex-row">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[1.5rem] font-bold text-[#1B2559] dark:text-white">
              Active Users
            </h3>
            <p className="text-[14px] font-medium text-[#A3AED0] dark:text-gray-400">
              Active users per day
            </p>
          </div>
        </div>
        <DateRangeFilterDropdown
          initialFromDate={initialFromDate}
          initialToDate={initialToDate}
          useUrlParams={true}
        />
      </div>
      {activityData.length > 0 ? (
        <ReactApexCharts
          type="bar"
          height={400}
          series={activitySeries}
          options={activityChartOptions}
        />
      ) : (
        <div className="flex items-center justify-center h-[300px] text-gray-500">
          No activity data available
        </div>
      )}
    </div>
  );
};

export default WeeklyActiveUsersChart;
