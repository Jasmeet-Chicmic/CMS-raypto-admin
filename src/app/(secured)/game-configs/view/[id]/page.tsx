import { Hash } from "lucide-react";
import GameConfigEditForm from "./GameConfigEditForm";
import {
  GameConfig,
  AmountLimit,
  getGameConfigByIdAction,
  getGameStatsAction,
} from "@/api/gameConfig";
import StatCard from "@/components/atoms/StatCard";
import { formatCurrency } from "@/shared/utils";
import GGRStatCard from "@/components/molecules/GGRStatCard";

export type { GameConfig, AmountLimit };

const GameConfigViewPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const data = await getGameConfigByIdAction(id);

  const gameConfig = data?.data?.data?.[0];

  if (!gameConfig) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Game configuration not found</p>
      </div>
    );
  }

  // Fetch game stats using the game type from config
  const statsResponse = await getGameStatsAction(gameConfig.type);
  const statsData = statsResponse?.data || null;

  const baseStats = [
    {
      title: "Total Bet Count",
      value: statsData ? statsData.totalBetCount : "0",
      subtitle: "All time bets",
      icon: <Hash className="w-6 h-6 text-[#4F46E5] dark:text-white" />,
      color: "bg-[#F4F7FE] dark:bg-[#4F46E5]",
    },
    {
      title: "Total Users",
      value: statsData ? formatCurrency(statsData.totalUsers) : "0",
      subtitle: "All time",
      icon: <Hash className="w-6 h-6 text-[#4318FF] dark:text-white" />,
      color: "bg-[#F4F7FE]  dark:bg-[#4F46E5]",
    },
  ];

  return (
    <div className="space-y-6 mt-[20px]">
      {/* Game Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        {baseStats.map((stat, index) => (
          <StatCard key={index} {...stat} index={index} />
        ))}
        {/* GGR Card with Currency Dropdown */}
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
      <GameConfigEditForm gameConfig={gameConfig} />
    </div>
  );
};

export default GameConfigViewPage;
