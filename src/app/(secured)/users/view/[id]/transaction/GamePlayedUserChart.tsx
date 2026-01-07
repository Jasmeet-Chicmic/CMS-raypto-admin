"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { fetchUserGamesPlayedAction } from "@/api/user";
import DateRangeFilterDropdown from "@/components/atoms/DateRangeFilter/DateRangeFilterDropdown";

const ReactApexCharts = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface GamePlayedUserChartProps {
  userId: string;
  className?: string;
}

const GamePlayedUserChart = ({
  userId,
  className = "",
}: GamePlayedUserChartProps) => {
  const [dateRange, setDateRange] = useState<{ from?: string; to?: string }>(
    {},
  );
  const [data, setData] = useState<{ date: string; gamesPlayed: number }[]>([]);
  const [loading, setLoading] = useState(true);
  console.log("Is Loading in Game Played User Chart ::", loading);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log("Fetching user games played...", userId, dateRange);
        const response = await fetchUserGamesPlayedAction({
          userId,
          ...(dateRange.from && { fromDate: dateRange.from }),
          ...(dateRange.to && { toDate: dateRange.to }),
        });
        console.log("response <><><><>", response);
        if (response?.status && response?.data?.result) {
          setData(response.data.result);
        } else {
          setData([]);
        }
      } catch (error) {
        console.error("Error fetching user games played:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, dateRange]);

  // Prepare data for chart
  const categories = data.map((item) => {
    const date = new Date(item.date);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  });

  const chartData = data.map((item) => item.gamesPlayed);

  // Chart options
  const chartOptions: ApexOptions = {
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
          colors: "#A3AED0",
          fontFamily: "inherit",
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
        formatter: (value: number) => `${value}`,
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
        colors: ["#9CA3AF"],
      },
    },
  };

  const series: ApexOptions["series"] = [
    {
      name: "Game Played",
      data: chartData,
    },
  ];

  return (
    <div
      className={`flex-1 bg-white rounded-[20px]  p-6 dark:bg-gray-900 dark:border-gray-800 ${className}`}
    >
      <div className="flex md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="w-full">
          <h3 className="text-[1.5rem] font-bold text-[#1B2559] dark:text-white">
            Games Played
          </h3>
          <p className="text-[14px] font-medium text-[#A3AED0] dark:text-gray-400">
            Number of games played over time
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <DateRangeFilterDropdown
            useUrlParams={false}
            onApply={(from, to) => setDateRange({ from, to })}
            onClear={() => setDateRange({})}
          />
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : data.length > 0 ? (
        <ReactApexCharts
          type="bar"
          // height={300}
          series={series}
          options={chartOptions}
        />
      ) : (
        <div className="flex items-center justify-center h-[300px] text-gray-500">
          No games played data available
        </div>
      )}
    </div>
  );
};

export default GamePlayedUserChart;
