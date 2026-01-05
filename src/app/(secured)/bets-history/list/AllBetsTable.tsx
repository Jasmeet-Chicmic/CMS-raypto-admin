"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import Pagination from "@/components/atoms/Pagination";
import Table, { TableColumn } from "@/components/atoms/Table";
import {
  CURRENCY_TYPE_NAMES,
  GAME_TYPE_NAMES,
  GAME_RESULT,
} from "@/shared/constants";
import { ResponseType, SORT_DIRECTION } from "@/shared/types";
import { formatCurrency, formatDate, walletTruncate } from "@/shared/utils";
import type { BetHistory } from "./page";

const AllBetsTable = ({
  data,
}: {
  data: ResponseType & { data: { data: BetHistory[]; count: number } };
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortKey, setSortKey] = useState("");
  const [sortDirection, setSortDirection] = useState<SORT_DIRECTION>(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams.toString());

    if (currentPage > 1) {
      newParams.set("skip", ((currentPage - 1) * pageSize).toString());
    } else {
      newParams.delete("skip");
    }

    if (pageSize !== 10) {
      newParams.set("limit", pageSize.toString());
    } else {
      newParams.delete("limit");
    }

    if (sortKey) {
      newParams.set("sortKey", sortKey);
      newParams.set("sortDirection", sortDirection.toString());
    } else {
      newParams.delete("sortKey");
      newParams.delete("sortDirection");
    }

    router.push(`?${newParams.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, sortKey, sortDirection]);

  const columns: TableColumn<BetHistory>[] = [
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
          <span className="font-medium">{formatCurrency(item.betAmount)}</span>
          <span className="text-[0.875rem] text-[#A3AED0]">
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
        <span className="text-[#1b2559] text-[0.875rem] dark:text-[#ffffff]">
          {formatDate(item.createdAt)}
        </span>
      ),
      sortable: true,
      sortKey: "createdAt",
    },
  ];

  return (
    <>
      <Table<BetHistory>
        data={data?.data?.data || []}
        columns={columns}
        keyExtractor={(item) => item._id || ""}
        handleSort={(sortKey, sortDirection) => {
          setSortKey(sortKey);
          setSortDirection(sortDirection);
        }}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
      />
      <Pagination
        totalItems={data?.data?.count ?? 0}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={(page) => setCurrentPage(page + 1)}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
        title="bets"
      />
    </>
  );
};

export default AllBetsTable;
