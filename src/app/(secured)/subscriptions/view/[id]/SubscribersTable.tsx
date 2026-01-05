"use client";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import Pagination from "@/components/atoms/Pagination";
import SearchInput from "@/components/atoms/SearchInput";
import Table, { TableColumn } from "@/components/atoms/Table";
import { User, UserSubscription } from "@/shared/types";

const SubscribersTable = ({
  subscribers,
  total,
}: {
  subscribers: (UserSubscription & { user: User })[];
  total: number;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const columns: TableColumn<UserSubscription & { user: User }>[] = [
    {
      field: "user",
      title: "Name",
      render: (item) => {
        return <span>{item?.user?.name}</span>;
      },
    },
    {
      field: "startDate",
      title: "Start Date",
      render: (item) => {
        return <span>{format(new Date(item?.startDate), "dd/MM/yyyy")}</span>;
      },
    },
    {
      field: "endDate",
      title: "End Date",
      render: (item) => {
        return <span>{format(new Date(item?.endDate), "dd/MM/yyyy")}</span>;
      },
    },
  ];
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (currentPage > 1) {
      newParams.set("skip", ((currentPage - 1) * pageSize).toString());
    } else {
      newParams.delete("skip"); // Optional: clean URL
    }
    if (pageSize > 10) {
      newParams.set("limit", pageSize.toString());
    } else {
      newParams.delete("limit");
    }
    if (search) {
      newParams.set("search", search);
    } else {
      newParams.delete("search");
    }
    router.push(`?${newParams.toString()}`);
  }, [currentPage, pageSize, searchParams, router, search]);
  return (
    <>
      <SearchInput value={search} onChange={(e) => setSearch(e)} />
      <div className="mt-4" />
      <Table
        columns={columns}
        data={subscribers}
        keyExtractor={(item) => item?._id}
        hideSelectCol
      />
      <Pagination
        title="Subscribers"
        totalItems={total}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={(page) => setCurrentPage(page)}
        onPageSizeChange={(size) => setPageSize(size)}
      />
    </>
  );
};

export default SubscribersTable;
