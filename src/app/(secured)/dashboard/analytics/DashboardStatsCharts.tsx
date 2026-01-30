"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { Users, Activity, TrendingUp } from "lucide-react";
import { useTheme } from "next-themes";
import StatCard from "@/components/atoms/StatCard";
import {
  CURRENCY_TYPE_NAMES,
  THEME_TYPE,
  CHART_COLORS,
} from "@/shared/constants";
import { formatCurrency } from "@/shared/utils";
import WeeklyActiveUsersChart from "./WeeklyActiveUsersChart";
import WorldMapChart from "./WorldMapChart";
import RevenuePerGameChart from "./RevenuePerGameChart";
import GGRStatCard from "@/components/molecules/GGRStatCard";

const ReactApexCharts = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export interface DashboardStat {
  totalRewardAmount: number;
  currency: number;
  grossGamingRevenue: number;
}
interface CurrencyGGR {
  currency: number;
  amount: number;
}
export interface DashboardStatsData {
  activeUsers: number;
  activeBets: number;
  totalBetAmount24Hrs: number;
  stats: DashboardStat[];
  totalReferralCount: number;
  totalEnabledGames: number;
  totalProfit: CurrencyGGR[];
}

export interface ActivityData {
  date: string;
  activeUsers: number;
}

export interface CountryData {
  totalUsers: number;
  country: string;
}

interface DashboardStatsChartsProps {
  data: DashboardStatsData;
  activityData?: ActivityData[];
  countryData?: CountryData[];
  initialFromDate?: string;
  initialToDate?: string;
}

const DashboardStatsCharts = ({
  data,
  activityData = [],
  countryData = [],
  initialFromDate = "",
  initialToDate = "",
}: DashboardStatsChartsProps) => {
  const { resolvedTheme } = useTheme();
  // Sort stats by currency type for consistent order
  const sortedStats = [...(data.stats || [])].sort(
    (a, b) => a.currency - b.currency,
  );

  // Prepare data for GGR line chart
  const categories = sortedStats.map(
    (stat) => CURRENCY_TYPE_NAMES[stat.currency] || `Currency ${stat.currency}`,
  );

  const ggrData = sortedStats.map(
    (stat) => Math.round(stat.grossGamingRevenue * 100) / 100,
  );

  const chartColor = useMemo(
    () =>
      resolvedTheme === THEME_TYPE.DARK
        ? CHART_COLORS.SECONDARY
        : CHART_COLORS.PRIMARY,
    [resolvedTheme],
  );

  // GGR Area Chart options
  const ggrChartOptions: ApexOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    stroke: {
      curve: "smooth",
      width: 2,
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
          {
            offset: 0,
            color: chartColor,
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
    colors: [chartColor],
    markers: {
      size: 5,
      colors: [chartColor],
      strokeColors: chartColor,
      strokeWidth: 2,
    },
    tooltip: {
      y: {
        formatter: (value: number) => formatCurrency(value),
      },
    },
    grid: {
      borderColor: "transparent",
      strokeDashArray: 4,
    },
    dataLabels: {
      enabled: false,
    },
  };

  const ggrSeries: ApexOptions["series"] = [
    {
      name: "Gross Gaming Revenue",
      data: ggrData,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Active Users"
          value={data.activeUsers.toLocaleString()}
          subtitle="Last 24 hours"
          icon={<Users className="w-6 h-6 text-white dark:text-black" />}
          color="bg-primarycolor dark:bg-secondarycolor"
        />
        <StatCard
          title="Active Games"
          value={data.totalEnabledGames}
          // subtitle="Ongoing bets"
          icon={<Activity className="w-6 h-6 text-bgwhite dark:text-bgblack" />}
          color="bg-primarycolor dark:bg-secondarycolor"
        />
        <StatCard
          title="Total Bets (24h)"
          value={formatCurrency(data.totalBetAmount24Hrs)}
          // subtitle="Last 24 hours"
          icon={
            <TrendingUp className="w-6 h-6 text-bgwhite dark:text-bgblack" />
          }
          color="bg-primarycolor dark:bg-secondarycolor"
        />
        {/* <StatCard
          title="Total Profit"
          value={formatCurrency(data.totalProfit)}
          // subtitle="Last 24 hours"
          icon={<Users className="w-6 h-6 text-bgpurple1" />}
          color="bg-bordercolor1 dark:bg-primarycolor"
        /> */}
        {/* <StatCard
          title="Dummy State"
          value={data.activeUsers.toLocaleString()}
          subtitle="Last 24 hours"
          icon={<Users className="w-6 h-6 text-bgpurple1" />}
          iconBgColor="bg-bordercolor1 dark:bg-primarycolor"
        />
        <StatCard
          title="Dummy State"
          value={data.activeUsers.toLocaleString()}
          subtitle="Last 24 hours"
          icon={<Users className="w-6 h-6 text-bgpurple1" />}
          iconBgColor="bg-bordercolor1 dark:bg-primarycolor"
        /> */}
        {data.totalProfit && data.totalProfit.length > 0 && (
          <GGRStatCard
            stats={data.totalProfit}
            title="Total Profit"
            color="bg-primarycolor dark:bg-secondarycolor"
          />
        )}
      </div>

      <div className="flex w-full gap-4 flex-col md:flex-row">
        {/* GGR Line Chart */}
        <div className="flex-1 bg-bgwhite border border-b border-bordergray200ordercolor1 rounded-[20px]  p-6 dark:bg-darkbgprimary dark:border-darkbordercolor1">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[1.5rem] font-bold text-textprimary dark:text-bgwhite">
                Gross Gaming Revenue
              </h3>
              <p className="text-[14px] font-medium text-textparagraph dark:text-textparagraphlight">
                Revenue by currency
              </p>
            </div>
          </div>
          {sortedStats.length > 0 ? (
            <ReactApexCharts
              type="area"
              height={400}
              series={ggrSeries}
              options={ggrChartOptions}
            />
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              No data available
            </div>
          )}
        </div>

        {/* Weekly Active Users Chart */}
        <div className="flex-1 bg-bgwhite border border-b border-bordergray200ordercolor1 rounded-[20px]  p-6 dark:bg-darkbgprimary dark:border-darkbordercolor1">
          <WeeklyActiveUsersChart
            activityData={activityData}
            initialFromDate={initialFromDate}
            initialToDate={initialToDate}
          />
        </div>
      </div>

      {/* World Map Chart & Revenue per Game */}
      <div className="flex w-full gap-4 flex-col md:flex-row">
        <div className="flex-1 bg-bgwhite border border-b border-bordergray200ordercolor1 rounded-[20px]  p-6 dark:bg-darkbgprimary dark:border-darkbordercolor1 w-full md:w-1/2">
          <WorldMapChart
            data={countryData.map((item) => ({
              country: item.country,
              value: item.totalUsers,
            }))}
          />
        </div>
        <div className="flex-1 bg-bgwhite border border-b border-bordergray200ordercolor1 rounded-[20px]  p-6 dark:bg-darkbgprimary dark:border-darkbordercolor1 w-full md:w-1/2">
          <RevenuePerGameChart />
        </div>
      </div>
    </div>
  );
};

export default DashboardStatsCharts;
