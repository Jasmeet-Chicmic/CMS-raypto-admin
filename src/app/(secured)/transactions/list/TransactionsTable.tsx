"use client";
import React, { useState } from "react";
import Table, { TableColumn } from "@/components/atoms/Table";
import Pagination from "@/components/atoms/Pagination";
import {
  TRANSACTION_SOURCE_TYPES,
  TRANSACTION_TYPES,
} from "@/shared/constants";
import {
  BookCheck,
  CreditCard,
  DollarSign,
  RussianRuble,
  Wallet,
} from "lucide-react";
import { getTransactionSourceDetails } from "@/shared/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { User } from "@/shared/types";

export interface TransactionProps {
  amount: number;
  description: string;
  paymentType: number;
  sourceType: number;
  _id: string;
  type: number;
  withdrawableBalance: number;
  nonWithdrawableBalance: number;
  status: number;
  user: User;
}

interface TransactionsTableProps {
  data: { data: TransactionProps[]; count: number };
  page: number | undefined;
  limit: number | undefined;
}

const TransactionsTable = ({ data, page, limit }: TransactionsTableProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams.toString());

    newParams.set("page", (page + 1).toString());

    if (limit) {
      newParams.set("limit", limit.toString());
    } else {
      newParams.delete("limit");
    }

    router.push(`?${newParams.toString()}`);
  };

  const handlePageSizeChange = (size: number) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (size) {
      newParams.set("limit", size.toString());
      newParams.set("page", "1");
    } else {
      newParams.delete("limit");
    }

    router.push(`?${newParams.toString()}`);
  };

  const icons = {
    [TRANSACTION_SOURCE_TYPES.WALLET]: (
      <div className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-[0.875] font-medium text-purple-500 ring-1 ring-purple-500/10 ring-inset">
        <Wallet size={24} />
      </div>
    ),
    [TRANSACTION_SOURCE_TYPES.BANK_TRANSFER]: (
      <div className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-[0.875] font-medium text-green-500 ring-1 ring-green-500/10 ring-inset">
        <BookCheck size={24} />
      </div>
    ),
    [TRANSACTION_SOURCE_TYPES.PAYPAL]: (
      <div className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-[0.875] font-medium text-red-500 ring-1 ring-red-500/10 ring-inset">
        <RussianRuble size={24} />
      </div>
    ),
    [TRANSACTION_SOURCE_TYPES.CARD]: (
      <div className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-[0.875] font-medium text-gray-500 ring-1 ring-gray-500/10 ring-inset">
        <CreditCard size={24} />
      </div>
    ),
    [TRANSACTION_SOURCE_TYPES.BANK_TRANSACTION]: (
      <div className="inline-flex items-center rounded-md bg-sky-50 px-2 py-1 text-[0.875] font-medium text-sky-500 ring-1 ring-sky-500/10 ring-inset">
        <DollarSign size={24} />
      </div>
    ),
  };

  const columns: TableColumn<TransactionProps>[] = [
    // {
    //   field: "user.wallet",
    //   title: "Wallet",
    //   // render: (data) => walletTruncate(data?.user?.wallet),
    //   sortable: true,
    //   sortKey: "wallet",
    // },
    {
      field: "_id",
      title: "Transaction ID",
      render: (data) => (data._id ? `#${data._id.slice(-6)}` : "N/A"),
    },
    {
      field: "sourceType",
      title: "Method",
      render: (data) => (
        <div className="flex items-center">
          {icons[data.sourceType as keyof typeof icons]}
          <span className="ml-2">
            {getTransactionSourceDetails(data.sourceType)}
          </span>
        </div>
      ),
    },
    {
      field: "type",
      title: "Type",
      render: (data) => (
        <div>
          {data.type === TRANSACTION_TYPES.CREDIT ? (
            <div className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-[0.875] font-medium text-green-500 ring-1 ring-green-500/10 ring-inset">
              Credit
            </div>
          ) : (
            <div className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-[0.875] font-medium text-red-500 ring-1 ring-red-500/10 ring-inset">
              Debit
            </div>
          )}
        </div>
      ),
    },
    { field: "description", title: "Description" },
    {
      field: "amount",
      title: "Amount",
      render: (data) => <div>{`$${data.amount}`}</div>,
    },
  ];

  return (
    <>
      <Table<TransactionProps>
        data={data?.data || []}
        columns={columns}
        keyExtractor={(item) => item._id}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
      />
      <Pagination
        totalItems={data?.count || 0}
        currentPage={page || 1}
        pageSize={limit || 10}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        title="transactions"
      />
    </>
  );
};

export default TransactionsTable;
