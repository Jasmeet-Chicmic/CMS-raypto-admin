import React from "react";

// import SwiperCard from "@/components/atoms/CustomSliders/SwiperCard";
// import AreaChart from "@/components/molecules/Charts/AreaChart";
// import ComparisonCard from "@/components/molecules/ComparisionCard";
// import EarningReportCard from "@/components/molecules/EarningReport/EarningReportChart";
// import SupportTrackerCard from "@/components/molecules/SupportTrackerCard";
// import ListingCard from "@/components/molecules/ListingCard";
// import TotalEarningCard from "@/components/molecules/TotalEarningCard";
import DashboardStatsCharts, {
  DashboardStatsData,
  ActivityData,
} from "./DashboardStatsCharts";

// import { LISTING_CARD_TYPES } from "@/components/molecules/ListingCard/helpers/types";
// import {
//   fetchAverageDailySales,
//   fetchDashboardAnalytics,
//   fetchEarningsReport,
//   fetchSalesByCountry,
//   fetchSalesOverview,
//   fetchSupportTickets,
//   fetchTopTransactions,
//   fetchTotalEarnings,
// } from "@/api/dashboard";

// import { LISTING_OPTION_VALUES } from "@/components/molecules/PopularProducts/helpers/types";
import { API_END_POINTS } from "@/shared/api";
import { getRequest } from "@/shared/fetcher";
import { ResponseType } from "@/shared/types";

interface AnalyticsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function getFirstParam<T>(param: T | T[] | undefined, defaultValue: T): T {
  if (Array.isArray(param)) return param[0];
  if (param !== undefined) return param;
  return defaultValue;
}

// Helper to get default date range (last 7 days, max 1 month allowed)
function getDefaultDateRange() {
  const today = new Date();
  const fromDate = new Date();
  fromDate.setDate(today.getDate() - 6); // Last 7 days including today

  return {
    fromDate: fromDate.toISOString().split("T")[0],
    toDate: today.toISOString().split("T")[0],
  };
}

const Analytics = async ({ searchParams }: AnalyticsPageProps) => {
  const params = await searchParams;
  const defaultDates = getDefaultDateRange();

  // Get date range from URL params or use defaults
  const fromDate = getFirstParam(params.fromDate, defaultDates.fromDate);
  const toDate = getFirstParam(params.toDate, defaultDates.toDate);

  // Fetch all dashboard data including new stats
  const [dashboardStats, dashboardActivity, dashboardCountry] =
    await Promise.all([
      getRequest<ResponseType & { data: DashboardStatsData }>(
        API_END_POINTS.DASHBOARD_STATS,
      ),
      getRequest<
        ResponseType & { data: { result: ActivityData[] } },
        { fromDate: string; toDate: string }
      >(API_END_POINTS.DASHBOARD_ACTIVITY, { fromDate, toDate }),
      getRequest<
        ResponseType & {
          data: { result: { totalUsers: number; country: string }[] };
        }
      >(API_END_POINTS.DASHBOARD_COUNTRY),
    ]);

  // console.log("Rendering Analytics Page", websiteAnalyticsData);
  return (
    <div className="p-0 mt-[20px]">
      {/* Dashboard Stats Section */}
      <div className="mb-6">
        <DashboardStatsCharts
          data={
            dashboardStats?.data || {
              activeUsers: 0,
              activeBets: 0,
              totalBetAmount24Hrs: 0,
              stats: [],
            }
          }
          activityData={dashboardActivity?.data?.result || []}
          countryData={dashboardCountry?.data?.result || []}
          initialFromDate={fromDate}
          initialToDate={toDate}
        />
      </div>

      {/* <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 max-h-fit">
        <SwiperCard
          title="Website Analytics"
          subtitle="Traffic & Conversions"
          data={[]}
          height="auto"
        />

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 max-h-fit">
          <AreaChart config={dailySalesChartConfig} />
          <ComparisonCard
            title="Sales Overview"
            totalValue={salesOverview.totalValue}
            changePercent={salesOverview.changeInPercent}
            items={[]}
          />
        </div>

        <EarningReportCard
          title="Earning Reports"
          subtitle="Weekly Earnings Overview"
          stats={[]}
          series={[]}
        />

        <SupportTrackerCard
          title="Support Tracker"
          subtitle="Last 7 Days"
          totalCount={supportTickets.totalCount}
          progressPercent={supportTickets.progressPercent}
          stats={[]}
        />

        <div className="col-span-full grid grid-cols-1 sm:grid-cols-3 gap-6 mb-[10px]">
          <ListingCard
            title="Sales by Countries"
            subtitle="Monthly Sales Overview"
            data={[]}
            menuOptions={LISTING_OPTIONS}
            listingCardType={LISTING_CARD_TYPES.SALES}
            filterKeyName="salesByCountry"
          />

          <TotalEarningCard
            title="Total Earning"
            percentage={Number(totalEarningsData.percentage)}
            change={Number(totalEarningsData.change)}
            categories={["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]}
            series={totalEarningsData.series}
            stats={[]}
          />

          <ListingCard
            title="Top Transactions"
            subtitle={`Total ${topTransactionsData.total || 0} Transactions done in this ${topTransactionDuration}`}
            data={[]}
            menuOptions={LISTING_OPTIONS}
            listingCardType={LISTING_CARD_TYPES.TRANSACTION}
            filterKeyName="topTransactions"
          />
        </div>
      </div> */}
    </div>
  );
};
export default Analytics;
