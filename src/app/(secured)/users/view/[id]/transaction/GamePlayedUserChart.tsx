"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useTheme } from "next-themes";
import { THEME_TYPE, CHART_COLORS } from "@/shared/constants";
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
  const { resolvedTheme } = useTheme();
  const isDark = useMemo(
    () => resolvedTheme === THEME_TYPE.DARK,
    [resolvedTheme],
  );
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
  const chartOptions = useMemo(
    () =>
      getGamesPlayedChartOptions(
        categories,
        isDark ? CHART_COLORS.SECONDARY : CHART_COLORS.PRIMARY,
      ),
    [categories, isDark],
  );
  const series = useMemo(() => getGamesPlayedSeries(chartData), [chartData]);

  return (
    <div
      className={`flex-1 bg-bgwhite border border-b border-bordergray200ordercolor1 rounded-[20px] p-6 dark:bg-darkbgprimary dark:border-darkbordercolor1 ${className}`}
    >
      <div className="flex md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="w-full">
          <h3 className="text-[1.5rem] font-bold text-textprimary dark:text-bgwhite">
            Games Played
          </h3>
          <p className="text-[14px] font-medium text-textparagraph dark:text-textparagraphlight">
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
