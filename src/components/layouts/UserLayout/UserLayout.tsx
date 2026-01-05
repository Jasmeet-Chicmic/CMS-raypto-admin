import { ReactNode } from "react";
import { Gamepad2, TrendingUp } from "lucide-react";

// import PlanDetailsCard from "@/components/molecules/user/PlanDetailsCard";
import UserProfileCard from "@/components/molecules/user/UserProfileCard";
import UserTabs from "@/components/molecules/user/UserTabs/UserTabs";
import StatCard from "@/components/atoms/StatCard";
import { User, UserSubscription } from "@/shared/types";
// import { formatCurrency } from "@/shared/utils";
import GGRStatCard from "@/components/molecules/GGRStatCard";
import UserRevenuePerGameChart from "@/app/(secured)/users/view/[id]/transaction/UserRevenuePerGameChart";

interface CurrencyGGR {
  currency: number;
  amount: number;
}

interface UserStats {
  totalBetCount: number;
  totalBetAmount: CurrencyGGR[];
  uniqueGamesPlayed: number;
  grossGamingRevenue: CurrencyGGR[];
  referralEarnedAmount: CurrencyGGR[];
  promotionEarnedAmount: CurrencyGGR[];
}

interface UserLayoutProps {
  children: ReactNode;
  data: User;
  currentSubscription?: UserSubscription;
  statsData?: UserStats;
}

const UserLayout = async ({
  children,
  data,
  // currentSubscription,
  statsData,
}: UserLayoutProps) => {
  const userStats = [
    {
      title: "Total Bet Count",
      value: statsData?.totalBetCount || 0,
      subtitle: "All time bets",
      icon: <Gamepad2 className="w-6 h-6 text-white dark:text-white" />,
      color: "bg-[#4F46E5] dark:bg-[#4F46E5]",
    },
    // {
    //   title: "Total Bet Amount",
    //   value: formatCurrency(statsData?.totalBetAmount || 0),
    //   subtitle: "All time",
    //   icon: <DollarSign className="w-6 h-6 text-[#4318FF]" />,
    //   color: "bg-[#F4F7FE] dark:bg-emerald-900/30",
    // },
    {
      title: "Unique Games Played",
      value: statsData?.uniqueGamesPlayed || 0,
      subtitle: "Different games",
      icon: <TrendingUp className="w-6 h-6 text-white dark:text-white" />,
      color: "bg-[#4F46E5] dark:bg-[#4F46E5]",
    },
    // {
    //   title: "Referral Earned Amount",
    //   value: formatCurrency(statsData?.referralEarnedAmount || 0),
    //   subtitle: "All time",
    //   icon: <DollarSign className="w-6 h-6 text-emerald-600" />,
    //   color: "bg-emerald-100 dark:bg-emerald-900/30",
    // },
    // {
    //   title: "Promotion & Reward Earned",
    //   value: formatCurrency(statsData?.promotionEarnedAmount || 0),
    //   subtitle: "All time",
    //   icon: <DollarSign className="w-6 h-6 text-emerald-600" />,
    //   color: "bg-emerald-100 dark:bg-emerald-900/30",
    // },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 p-0 my-6">
        {userStats.map((stat, index) => (
          <StatCard key={index} stat={stat} index={index} />
        ))}
        {/* {statsData?.referralEarnedAmount &&
          statsData.referralEarnedAmount.length > 0 && (
            <GGRStatCard
              stats={statsData.referralEarnedAmount}
              title="Referral Earned Amount"
            />
          )}
        {statsData?.promotionEarnedAmount &&
          statsData.promotionEarnedAmount.length > 0 && (
            <GGRStatCard
              stats={statsData.promotionEarnedAmount}
              title="Promotion & Reward Earned"
            />
          )} */}
        {statsData?.grossGamingRevenue &&
          statsData.grossGamingRevenue.length > 0 && (
            <GGRStatCard stats={statsData.grossGamingRevenue} />
          )}
        {statsData?.totalBetAmount && statsData.totalBetAmount.length > 0 && (
          <GGRStatCard
            stats={statsData.totalBetAmount}
            title="Total Bet Amount"
          />
        )}
      </div>
      <div className="p-0 flex flex-col lg:flex-col gap-6">
        {/* Sidebar */}
        <div className="w-full lg:w-full flex flex-col md:flex-row gap-4">
          <UserProfileCard userData={data} />
          {/* <PlanDetailsCard
          userData={data}
          currentSubscription={currentSubscription}\
        /> */}
          <UserRevenuePerGameChart userId={data?._id || ""} />
        </div>

        {/* Main Content */}
        <div className="w-full lg:w-full flex flex-col gap-4">
          {/* User Stats Cards */}

          <UserTabs userId={data?._id || ""} />
          {children}
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
