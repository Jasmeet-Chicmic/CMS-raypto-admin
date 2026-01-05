"use client";

import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { Users, Activity, TrendingUp } from "lucide-react";
import StatCard from "@/components/atoms/StatCard";
import { CURRENCY_TYPE_NAMES } from "@/shared/constants";
import { formatCurrency } from "@/shared/utils";
import WeeklyActiveUsersChart from "./WeeklyActiveUsersChart";
import WorldMapChart from "./WorldMapChart";
import RevenuePerGameChart from "./RevenuePerGameChart";
import GGRStatCard from "@/components/molecules/GGRStatCard";

const ReactApexCharts = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

// const COUNTRY_DATA = [
//   { country: "DE", value: "121224" },
//   { country: "EP", value: "46667" },
//   { country: "US", value: "37193" },
//   { country: "WO", value: "33117" },
//   { country: "CN", value: "16899" },
//   { country: "AT", value: "12168" },
//   { country: "JP", value: "10993" },
//   { country: "FR", value: "8096" },
//   { country: "GB", value: "7355" },
//   { country: "ES", value: "6264" },
//   { country: "CA", value: "5470" },
//   { country: "CH", value: "5082" },
//   { country: "IT", value: "4087" },
//   { country: "BR", value: "3668" },
//   { country: "SE", value: "3555" },
//   { country: "AU", value: "3368" },
//   { country: "DK", value: "3317" },
//   { country: "KR", value: "2822" },
//   { country: "RU", value: "2391" },
//   { country: "NL", value: "2227" },
//   { country: "BE", value: "1912" },
//   { country: "TW", value: "1472" },
//   { country: "NO", value: "1439" },
//   { country: "ZA", value: "1339" },
//   { country: "FI", value: "1321" },
//   { country: "PL", value: "1075" },
//   { country: "IN", value: "877" },
//   { country: "PT", value: "720" },
//   { country: "MX", value: "607" },
//   { country: "AR", value: "592" },
//   { country: "HK", value: "536" },
//   { country: "GR", value: "421" },
//   { country: "UA", value: "409" },
//   { country: "HU", value: "397" },
//   { country: "IL", value: "323" },
//   { country: "YU", value: "314" },
//   { country: "CZ", value: "255" },
//   { country: "SU", value: "227" },
//   { country: "IE", value: "224" },
//   { country: "TR", value: "212" },
//   { country: "NZ", value: "146" },
//   { country: "LU", value: "138" },
//   { country: "CS", value: "137" },
//   { country: "CL", value: "126" },
//   { country: "SG", value: "120" },
//   { country: "DD", value: "102" },
//   { country: "SI", value: "93" },
//   { country: "ID", value: "92" },
//   { country: "PE", value: "84" },
//   { country: "SK", value: "74" },
//   { country: "HR", value: "63" },
//   { country: "MY", value: "52" },
//   { country: "EG", value: "36" },
//   { country: "BG", value: "34" },
//   { country: "EA", value: "26" },
//   { country: "RO", value: "26" },
//   { country: "MA", value: "23" },
//   { country: "LT", value: "15" },
//   { country: "CO", value: "14" },
//   { country: "MC", value: "13" },
//   { country: "TN", value: "12" },
//   { country: "RS", value: "11" },
//   { country: "CY", value: "6" },
//   { country: "LV", value: "6" },
//   { country: "EE", value: "4" },
//   { country: "CU", value: "3" },
//   { country: "SA", value: "3" },
//   { country: "DZ", value: "2" },
//   { country: "IS", value: "2" },
//   { country: "UY", value: "2" },
//   { country: "AP", value: "1" },
//   { country: "EC", value: "1" },
//   { country: "GE", value: "1" },
//   { country: "JO", value: "1" },
//   { country: "ME", value: "1" },
//   { country: "NI", value: "1" },
//   { country: "PH", value: "1" },
// ];

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
    xaxis: {
      categories,
      labels: {
        style: {
          colors: "#A3AED0",
          fontFamily: "inherit",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#A3AED0",
          fontFamily: "inherit",
        },
        formatter: (value: number) => formatCurrency(value),
      },
    },
    colors: ["#4F46E5"],
    markers: {
      size: 5,
      colors: ["#4F46E5"],
      strokeColors: "#4F46E5",
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
          icon={
            <Users className="w-6 h-6 text-[#ffffff] dark:text-[#ffffff]" />
          }
          color="bg-[#4F46E5] dark:bg-[#4F46E5]"
        />
        <StatCard
          title="Active Games"
          value={data.totalEnabledGames}
          // subtitle="Ongoing bets"
          icon={
            <Activity className="w-6 h-6 text-[#ffffff] dark:text-[#ffffff]" />
          }
          color="bg-[#4F46E5] dark:bg-[#4F46E5]"
        />
        <StatCard
          title="Total Bets (24h)"
          value={formatCurrency(data.totalBetAmount24Hrs)}
          // subtitle="Last 24 hours"
          icon={
            <TrendingUp className="w-6 h-6 text-[#ffffff] dark:text-[#ffffff]" />
          }
          color="bg-[#4F46E5] dark:bg-[#4F46E5]"
        />
        {/* <StatCard
          title="Total Profit"
          value={formatCurrency(data.totalProfit)}
          // subtitle="Last 24 hours"
          icon={<Users className="w-6 h-6 text-[#4F46E5]" />}
          color="bg-[#F4F7FE] dark:bg-[#4F46E5]"
        /> */}
        {/* <StatCard
          title="Dummy State"
          value={data.activeUsers.toLocaleString()}
          subtitle="Last 24 hours"
          icon={<Users className="w-6 h-6 text-[#4F46E5]" />}
          iconBgColor="bg-[#F4F7FE] dark:bg-[#4F46E5]"
        />
        <StatCard
          title="Dummy State"
          value={data.activeUsers.toLocaleString()}
          subtitle="Last 24 hours"
          icon={<Users className="w-6 h-6 text-[#4F46E5]" />}
          iconBgColor="bg-[#F4F7FE] dark:bg-[#4F46E5]"
        /> */}
        {data.totalProfit && data.totalProfit.length > 0 && (
          <GGRStatCard stats={data.totalProfit} title="Total Profit" />
        )}
      </div>

      <div className="flex w-full gap-4 flex-col md:flex-row">
        {/* GGR Line Chart */}
        <div className="flex-1 bg-white rounded-[20px]  p-6 dark:bg-gray-900 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[1.5rem] font-bold text-[#1B2559] dark:text-white">
                Gross Gaming Revenue
              </h3>
              <p className="text-[14px] font-medium text-[#A3AED0] dark:text-gray-400">
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
        <div className="flex-1 bg-white rounded-[20px]  p-6 dark:bg-gray-900 dark:border-gray-800">
          <WeeklyActiveUsersChart
            activityData={activityData}
            initialFromDate={initialFromDate}
            initialToDate={initialToDate}
          />
        </div>
      </div>

      {/* World Map Chart & Revenue per Game */}
      <div className="flex w-full gap-4 flex-col md:flex-row">
        <div className="flex-1 bg-white rounded-[20px]  p-6 dark:bg-gray-900 dark:border-gray-800 w-full md:w-1/2">
          <WorldMapChart
            data={countryData.map((item) => ({
              country: item.country,
              value: item.totalUsers,
            }))}
          />
        </div>
        <div className="flex-1 bg-white rounded-[20px]  p-6 dark:bg-gray-900 dark:border-gray-800 w-full md:w-1/2">
          <RevenuePerGameChart />
        </div>
      </div>
    </div>
  );
};

export default DashboardStatsCharts;
