import {
  StatCardSkeleton,
  AreaChartSkeleton,
  ChartCardSkeleton,
  MapChartSkeleton,
  HorizontalBarChartSkeleton,
  GGRStatCardSkeleton,
} from "@/components/atoms/Skeleton";

export default function Loading() {
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="p-0 mt-[20px]">
        {/* Dashboard Stats Skeleton */}
        <div className="space-y-6 mb-6">
          {/* Stat Cards Row - Matches DashboardStatsCharts layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* Active Users Card */}
            <StatCardSkeleton />
            {/* Active Games Card */}
            <StatCardSkeleton />
            {/* Total Bets Card */}
            <StatCardSkeleton />
            {/* GGR Stat Card with currency selector */}
            <GGRStatCardSkeleton />
          </div>

          {/* GGR Chart & Weekly Active Users Row */}
          <div className="flex w-full gap-4 flex-col md:flex-row">
            {/* GGR Area Chart */}
            <AreaChartSkeleton height={400} />
            {/* Weekly Active Users Bar Chart */}
            <ChartCardSkeleton height={400} />
          </div>

          {/* World Map & Revenue per Game Row */}
          <div className="flex w-full gap-4 flex-col md:flex-row">
            {/* World Map Chart */}
            <div className="flex-1 w-full md:w-1/2">
              <MapChartSkeleton />
            </div>
            {/* Revenue per Game Chart */}
            <div className="flex-1 w-full md:w-1/2">
              <HorizontalBarChartSkeleton bars={8} height={350} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
