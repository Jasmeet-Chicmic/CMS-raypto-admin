"use client";

import { useMemo } from "react";
import { CURRENCY_TYPE_NAMES, GAME_TYPE_NAMES } from "@/shared/constants";
import { ResponseType } from "@/shared/types";
import {
  formatCurrency,
  formatDate,
  walletTruncate,
  createSortableColumn,
} from "@/shared/utils";
import { DataTable, DataTableConfig } from "@/components/organisms/DataTable";
import type { BetHistory } from "./page";

// Common text color classes
const TEXT_SECONDARY = "text-[#A3AED0]";
const TEXT_PRIMARY_DARK = "text-[#1b2559] dark:text-[#ffffff]";

const BigBetsTable = ({
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
        createSortableColumn(
          "user",
          "User",
          (item) => (
            <div className="flex flex-col">
              <span className="font-medium text-gray-900 dark:text-white">
                {item.user?.name || "Unknown"}
              </span>
              <span className={`text-[0.875rem] ${TEXT_SECONDARY}`}>
                {item.user?.wallet ? walletTruncate(item.user.wallet) : "N/A"}
              </span>
            </div>
          ),
          "userName",
        ),
        createSortableColumn("type", "Game", (item) => (
          <span className="px-2 py-1 rounded-full text-[0.875] font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
            {GAME_TYPE_NAMES[item.type] || `Type ${item.type}`}
          </span>
        )),
        createSortableColumn("betAmount", "Bet Amount", (item) => (
          <div className="flex items-center gap-1">
            <span className="font-medium">
              {formatCurrency(item.betAmount)}
            </span>
            <span className={`text-[0.775rem] ${TEXT_SECONDARY}`}>
              {CURRENCY_TYPE_NAMES[item.currency] || ""}
            </span>
          </div>
        )),
        createSortableColumn("createdAt", "Date", (item) => (
          <span className={`text-[0.875rem] ${TEXT_PRIMARY_DARK}`}>
            {formatDate(item.createdAt)}
          </span>
        )),
      ],
      keyExtractor: (item) => item._id || "",
      paginationTitle: "big bets",
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

export default BigBetsTable;
