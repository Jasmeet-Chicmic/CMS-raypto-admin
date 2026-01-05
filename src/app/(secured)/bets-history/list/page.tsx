import { ResponseType, SORT_DIRECTION } from "@/shared/types";
import BetsHistoryTabs from "./BetsHistoryTabs";
import { STATUS_CODE, STATUS_TYPE } from "@/shared/constants";
import {
  BetHistory,
  getBetsHistoryAction,
  getBigBetsHistoryAction,
} from "@/api/betsHistory";

export type { BetHistory };
export type { BetUser } from "@/api/betsHistory";

const BetsHistoryPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    searchString?: string;
    skip?: number;
    limit?: number;
    sortKey?: string;
    sortDirection?: SORT_DIRECTION;
    tab?: string;
    type?: number;
    currency?: number;
    gameResult?: number;
    fromDate?: string;
    toDate?: string;
  }>;
}) => {
  const {
    searchString,
    skip,
    limit,
    sortKey,
    sortDirection,
    tab,
    type,
    currency,
    gameResult,
    fromDate,
    toDate,
  } = await searchParams;

  // Fetch data only for the active tab
  const activeTab = tab || "all";

  let allBetsData: ResponseType & {
    data: { data: BetHistory[]; count: number };
  } = {
    status: true,
    message: "",
    type: STATUS_TYPE.SUCCESS,
    statusCode: STATUS_CODE.SUCCESS,
    data: { data: [], count: 0 },
  };
  let bigBetsData: ResponseType & {
    data: { data: BetHistory[]; count: number };
  } = {
    status: true,
    message: "",
    type: STATUS_TYPE.SUCCESS,
    statusCode: STATUS_CODE.SUCCESS,
    data: { data: [], count: 0 },
  };

  if (activeTab === "all") {
    allBetsData = await getBetsHistoryAction({
      ...(searchString && { searchString }),
      ...(skip && { skip }),
      ...(limit && { limit }),
      ...(sortKey && { sortKey, sortDirection }),
      ...(type && { type }),
      ...(currency && { currency }),
      ...(gameResult && { gameResult }),
      ...(fromDate && { fromDate }),
      ...(toDate && { toDate }),
    });
  } else if (activeTab === "big") {
    bigBetsData = await getBigBetsHistoryAction({
      ...(searchString && { searchString }),
      ...(skip && { skip }),
      ...(limit && { limit }),
      ...(sortKey && { sortKey, sortDirection }),
      ...(type && { type }),
      ...(currency && { currency }),
      ...(gameResult && { gameResult }),
      ...(fromDate && { fromDate }),
      ...(toDate && { toDate }),
    });
  }

  return (
    <div className="space-y-6 mt-[20px]">
      <div className="overflow-x-auto">
        <BetsHistoryTabs
          allBetsData={allBetsData}
          bigBetsData={bigBetsData}
          activeTab={activeTab}
          searchString={searchString || ""}
          initialFromDate={fromDate}
          initialToDate={toDate}
        />
      </div>
    </div>
  );
};

export default BetsHistoryPage;
