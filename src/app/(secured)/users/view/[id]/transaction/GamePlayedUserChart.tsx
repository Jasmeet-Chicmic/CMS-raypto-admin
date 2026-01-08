"use client";

import React, { useState, useEffect } from "react";
import { fetchUserGamesPlayedAction } from "@/api/user";
import DateRangeFilterDropdown from "@/components/atoms/DateRangeFilter/DateRangeFilterDropdown";
import { ChartContentRenderer } from "@/components/molecules/Charts/ChartContentRenderer";
import {
  getGamesPlayedChartOptions,
  getGamesPlayedSeries,
} from "@/shared/chartConfigs/gamesPlayedChartConfig";

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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchUserGamesPlayedAction({
          userId,
          ...(dateRange.from && { fromDate: dateRange.from }),
          ...(dateRange.to && { toDate: dateRange.to }),
        });
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

  // Use shared chart configuration
  const chartOptions = getGamesPlayedChartOptions(categories);
  const series = getGamesPlayedSeries(chartData);

  return (
    <div
      className={`flex-1 bg-white rounded-[20px] p-6 dark:bg-gray-900 dark:border-gray-800 ${className}`}
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
      <ChartContentRenderer
        loading={loading}
        hasData={data.length > 0}
        series={series}
        options={chartOptions}
        height={300}
        emptyMessage="No games played data available"
      />
    </div>
  );
};

export default GamePlayedUserChart;
