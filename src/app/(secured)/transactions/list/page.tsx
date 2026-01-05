import { Clock, CreditCard, Download, UserCheck, Users } from "lucide-react";

import { fetchTransactionsList } from "@/api/transactions";
import SearchToolbar from "@/components/atoms/SearchToolbar";
import SelectFilter from "@/components/atoms/SelectFilter";
import StatsCard from "@/components/atoms/StatCard";
import { GetParamsType } from "@/shared/types";

import { TRANSACTION_STATUS_OPTIONS } from "./(helpers)/constant";
// import TransactionsTable from "./TransactionsTable";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const TransactionsManagement = async ({ searchParams }: PageProps) => {
  const searchParamsObj = await searchParams;
  let { searchString, sortKey, status } = searchParamsObj;
  const page = searchParamsObj.page;
  const limit = searchParamsObj.limit;
  // const type = searchParamsObj.type;
  // const sortDirection = searchParamsObj.sortDirection;
  // Ensure searchString and sortKey are strings
  if (Array.isArray(searchString)) searchString = searchString[0];
  if (Array.isArray(sortKey)) sortKey = sortKey[0];
  if (Array.isArray(status)) status = status[0];

  const parsedPage = typeof page === "string" ? Number.parseInt(page, 10) : 0;
  const parsedLimit =
    typeof limit === "string" ? Number.parseInt(limit, 10) : 10;
  // const parsedSortDirection =
  //   typeof sortDirection === "string"
  //     ? (Number.parseInt(sortDirection, 10) as SORT_DIRECTION)
  //     : undefined;

  const params: GetParamsType = {
    ...(searchString && { searchString }),
    // filterType: type ? Number(type) : 1,
    skip: (parsedPage > 0 ? parsedPage - 1 : 0) * parsedLimit,
    limit: parsedLimit,
    // ...(sortKey && { sortKey }),
    // ...(parsedSortDirection !== undefined && {
    //   sortDirection: parsedSortDirection,
    // }),
  };

  const data = await fetchTransactionsList(params);
  console.log("Transaction Data ::<><>", data);
  const stats = [
    {
      value: "120",
      subtitle: "Users",
      icon: <Users className="w-5 h-5" />,
      color: "bg-purple-100 text-purple-600",
      shadowColor: "border-t-0 border-l-0 border-r-0 border-purple-600",
    },
    {
      value: "120",
      subtitle: "Transactions",
      icon: <CreditCard className="w-5 h-5" />,
      color: "bg-red-100 text-red-600",
      shadowColor: "border-t-0 border-l-0 border-r-0 border-red-600",
    },
    {
      value: "$5.2k",
      subtitle: "Completed",
      icon: <UserCheck className="w-5 h-5" />,
      color: "bg-green-100 text-green-600",
      shadowColor: "border-t-0 border-l-0 border-r-0 border-green-600",
    },
    {
      value: "$1.1k",
      subtitle: "Pending",
      icon: <Clock className="w-5 h-5" />,
      color: "bg-orange-100 text-orange-600",
      shadowColor: "border-t-0 border-l-0 border-r-0 border-orange-600",
    },
  ];

  return (
    <div className="space-y-6 p-0 mt-[20px]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <StatsCard {...stat} key={stat.subtitle} index={index} />
        ))}
      </div>
      <div className="overflow-x-auto">
        <div className="bg-white rounded-t-lg shadow-sm border border-gray-200 dark:bg-gray-900 dark:border-gray-800">
          {/* Filters Section */}
          <div className="p-6 dark:border-gray-800">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <SearchToolbar
                  initialQuery={searchString || ""}
                  placeholder="Search Transactions"
                />
                <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Download size={18} />
                  <span>Export</span>
                </button>
              </div>
              <div className="flex justify-end items-center gap-x-3">
                <h2 className="text-lg font-semibold text-gray-900 ">
                  Filters
                </h2>
                <SelectFilter
                  paramName="type"
                  options={TRANSACTION_STATUS_OPTIONS}
                  defaultValue={TRANSACTION_STATUS_OPTIONS[0]}
                  placeholder="Filter by Type"
                  className="w-60"
                  isClearable={false}
                />
              </div>
            </div>
          </div>
        </div>
        {/* <TransactionsTable data={data} page={parsedPage} limit={parsedLimit} /> */}
      </div>
    </div>
  );
};

export default TransactionsManagement;
