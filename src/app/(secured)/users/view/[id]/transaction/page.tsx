import { API_END_POINTS } from "@/shared/api";
import { getRequest } from "@/shared/fetcher";
import { GetParamsType, ResponseType, SORT_DIRECTION } from "@/shared/types";
import TransactionTable from "./TransactionTable";
import TransactionStatsChart, {
  TransactionStat,
} from "./TransactionStatsChart";
// import UserRevenuePerGameChart from "./UserRevenuePerGameChart";
import GamePlayedUserChart from "./GamePlayedUserChart";

export interface UserTransaction {
  _id: string;
  type: number;
  currency: number;
  withdrawableBalance: number;
  nonWithdrawableBalance: number;
  status: number;
  createdAt: string;
  gameResult: number;
  gameType: number;
  gameMultiplier: number;
  user: {
    _id: string;
    wallet: string;
  };
}

const TransactionPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    skip?: number;
    limit?: number;
    fromDate?: string;
    toDate?: string;
    statsFromDate?: string;
    statsToDate?: string;
    sortKey?: string;
    sortDirection?: SORT_DIRECTION;
    currency?: number;
    status?: number;
    type?: number;
    gameType?: number;
    gameResult?: number;
  }>;
}) => {
  const { id } = await params;
  const {
    skip,
    limit,
    fromDate,
    toDate,
    statsFromDate,
    statsToDate,
    sortKey,
    sortDirection,
    currency,
    status,
    type,
    gameType,
    gameResult,
  } = await searchParams;

  // Fetch both transactions and stats in parallel
  const [data, statsData] = await Promise.all([
    getRequest<
      ResponseType & { data: { data: UserTransaction[]; count: number } },
      GetParamsType
    >(API_END_POINTS.USER_TRANSACTIONS, {
      userId: id,
      ...(skip && { skip }),
      ...(limit && { limit }),
      ...(fromDate && { fromDate }),
      ...(toDate && { toDate }),
      ...(sortKey && { sortKey }),
      ...(sortDirection && { sortDirection }),
      ...(currency && { currency }),
      ...(status && { status }),
      ...(type && { type }),
      ...(gameType && { gameType }),
      ...(gameResult && { gameResult }),
    }),
    getRequest<
      ResponseType & { data: { stats: TransactionStat[] } },
      GetParamsType
    >(API_END_POINTS.TRANSACTION_STATS, {
      userId: id,
      ...(statsFromDate && { fromDate: statsFromDate }),
      ...(statsToDate && { toDate: statsToDate }),
    }),
  ]);
  console.log("statsData", statsData);
  return (
    <div className="space-y-6">
      {/* Transaction Stats Chart */}

      {/* Transaction Table */}
      <div className="bg-white rounded-[20px] dark:bg-gray-900 dark:border-gray-800 w-full">
        <TransactionTable
          data={data?.data?.data || []}
          count={data?.data?.count || 0}
          initialFromDate={fromDate}
          initialToDate={toDate}
          initialSortKey={sortKey}
          initialSortDirection={sortDirection}
        />
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <TransactionStatsChart
          stats={statsData?.data?.stats || []}
          initialFromDate={statsFromDate}
          initialToDate={statsToDate}
        />
        <GamePlayedUserChart userId={id} />
        {/* <UserRevenuePerGameChart userId={id} /> */}
      </div>
    </div>
  );
};

export default TransactionPage;
