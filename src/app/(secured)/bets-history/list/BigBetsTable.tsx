"use client";

import { CURRENCY_TYPE_NAMES, GAME_TYPE_NAMES } from "@/shared/constants";
import { ResponseType } from "@/shared/types";
import { formatCurrency, formatDate, walletTruncate } from "@/shared/utils";
import { DataTable, DataTableConfig } from "@/components/organisms/DataTable";
import type { BetHistory } from "./page";

const BigBetsTable = ({
  data,
}: {
  data: ResponseType & { data: { data: BetHistory[]; count: number } };
}) => {
  const config: DataTableConfig<BetHistory> = {
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
            <span className="font-medium text-gray-900 dark:text-white">
              {item.user?.name || "Unknown"}
            </span>
            <span className="text-[0.875rem] text-[#A3AED0]">
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
            <span className="text-[0.775rem] text-[#A3AED0]">
              {CURRENCY_TYPE_NAMES[item.currency] || ""}
            </span>
          </div>
        ),
        sortable: true,
        sortKey: "betAmount",
      },
      {
        field: "createdAt",
        title: "Date",
        render: (item) => (
          <span className="text-[#1b2559] text-[0.875rem] dark:text-[#ffffff]">
            {formatDate(item.createdAt)}
          </span>
        ),
        sortable: true,
        sortKey: "createdAt",
      },
    ],
    keyExtractor: (item) => item._id || "",
    paginationTitle: "big bets",
  };

  return (
    <DataTable
      data={data?.data?.data || []}
      totalCount={data?.data?.count ?? 0}
      config={config}
    />
  );
};

export default BigBetsTable;
