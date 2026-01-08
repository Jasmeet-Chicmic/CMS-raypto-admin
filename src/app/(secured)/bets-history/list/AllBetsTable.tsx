"use client";

import { useMemo } from "react";
import {
  CURRENCY_TYPE_NAMES,
  GAME_TYPE_NAMES,
  GAME_RESULT,
} from "@/shared/constants";
import { ResponseType } from "@/shared/types";
import { formatCurrency, formatDate, walletTruncate } from "@/shared/utils";
import { DataTable, DataTableConfig } from "@/components/organisms/DataTable";
import type { BetHistory } from "./page";
import {
  TEXT_SECONDARY,
  TEXT_PRIMARY_DARK,
  TEXT_GRAY_WHITE,
  TEXT_SIZE_SM,
} from "@/shared/styles";

const AllBetsTable = ({
  data,
}: {
  data: ResponseType & { data: { data: BetHistory[]; count: number } };
}) => {
  const config: DataTableConfig<BetHistory> = useMemo(
    () => ({
      columns: [
        {
          field: "_id",
          title: "ID",
          render: (item) => (item?._id ? `#${item._id.slice(-8)}` : ""),
        },
        {
          field: "user",
          title: "User",
          render: (item) => (
            <div className="flex flex-col">
              <span className={`font-medium ${TEXT_GRAY_WHITE}`}>
                {item.user?.name || "Unknown"}
              </span>
              <span className={`${TEXT_SIZE_SM} ${TEXT_SECONDARY}`}>
                {item.user?.wallet ? walletTruncate(item.user.wallet) : "N/A"}
              </span>
            </div>
          ),
          sortable: true,
          sortKey: "userName",
        },
        {
          field: "type",
          title: "Game",
          render: (item) => (
            <span className="px-2 py-1 rounded-full text-[0.875] font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
              {GAME_TYPE_NAMES[item.type] || `Type ${item.type}`}
            </span>
          ),
          sortable: true,
          sortKey: "type",
        },
        {
          field: "betAmount",
          title: "Bet Amount",
          render: (item) => (
            <div className="flex items-center gap-1">
              <span className="font-medium">
                {formatCurrency(item.betAmount)}
              </span>
              <span className={`${TEXT_SIZE_SM} ${TEXT_SECONDARY}`}>
                {CURRENCY_TYPE_NAMES[item.currency] || ""}
              </span>
            </div>
          ),
          sortable: true,
          sortKey: "betAmount",
        },
        {
          field: "rewardMultiplier",
          title: "Multiplier",
          render: (item) => (
            <span
              className={`font-medium ${(item.rewardMultiplier || 0) > 0 ? "text-green-600" : "text-gray-500"}`}
            >
              {(item.rewardMultiplier || 0) > 0
                ? `${(item.rewardMultiplier || 0).toFixed(2)}x`
                : "-"}
            </span>
          ),
          sortable: true,
          sortKey: "rewardMultiplier",
        },
        {
          field: "rewardAmount",
          title: "Reward",
          render: (item) => (
            <span
              className={`font-medium ${(item.rewardAmount || 0) > 0 ? "text-green-600" : "text-gray-500"}`}
            >
              {(item.rewardAmount || 0) > 0
                ? formatCurrency(item.rewardAmount || 0)
                : "0"}
            </span>
          ),
          sortable: true,
          sortKey: "rewardAmount",
        },
        {
          field: "gameResult",
          title: "Result",
          render: (item) => (
            <span
              className={`px-2 py-1 rounded-full text-[0.875] font-medium ${
                item.gameResult === GAME_RESULT.WIN
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
              }`}
            >
              {item.gameResult === GAME_RESULT.WIN ? "Win" : "Loss"}
            </span>
          ),
          sortable: true,
          sortKey: "gameResult",
        },
        {
          field: "createdAt",
          title: "Date",
          render: (item) => (
            <span className={`${TEXT_PRIMARY_DARK} ${TEXT_SIZE_SM}`}>
              {formatDate(item.createdAt)}
            </span>
          ),
          sortable: true,
          sortKey: "createdAt",
        },
      ],
      keyExtractor: (item) => item._id || "",
      paginationTitle: "bets",
    }),
    [],
  );

  return (
    <DataTable
      data={data?.data?.data || []}
      totalCount={data?.data?.count ?? 0}
      config={config}
    />
  );
};

export default AllBetsTable;
