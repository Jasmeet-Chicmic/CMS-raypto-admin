import { SORT_DIRECTION } from "@/shared/types";
import GameConfigTable from "./GameConfigTable";
import {
  GameConfig,
  AmountLimit,
  getGameConfigsAction,
} from "@/api/gameConfig";

export type { GameConfig, AmountLimit };

const GameConfigsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    searchString?: string;
    skip?: number;
    limit?: number;
    sortKey?: string;
    sortDirection?: SORT_DIRECTION;
    isEnabled?: string;
    isMaintenance?: string;
    currency?: string;
  }>;
}) => {
  const {
    searchString,
    skip,
    limit,
    sortKey,
    sortDirection,
    isEnabled,
    isMaintenance,
    currency,
  } = await searchParams;

  const data = await getGameConfigsAction({
    ...(searchString && { searchString }),
    ...(skip && { skip }),
    ...(limit && { limit }),
    ...(sortKey && { sortKey, sortDirection }),
    ...(isEnabled !== undefined && { isEnabled: isEnabled === "true" }),
    ...(isMaintenance !== undefined && {
      isMaintenance: isMaintenance === "true",
    }),
    currency: currency ? Number(currency) : 1,
  });

  return (
    <div className="space-y-6 mt-[20px]">
      <div className="overflow-x-auto">
        <GameConfigTable data={data} searchString={searchString || ""} />
      </div>
    </div>
  );
};

export default GameConfigsPage;
