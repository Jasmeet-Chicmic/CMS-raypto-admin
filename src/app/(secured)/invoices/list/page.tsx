import { Clock, CreditCard, Download, UserCheck, Users } from "lucide-react";

import SearchToolbar from "@/components/atoms/SearchToolbar";
import StatsCard from "@/components/atoms/StatCard";
import { API_END_POINTS } from "@/shared/api";
import { USER_ROLES } from "@/shared/constants";
import { getRequest } from "@/shared/fetcher";
import { GetParamsType, Invoice, SORT_DIRECTION } from "@/shared/types";

import RedirectButton from "./helpers/CreateButton";
import InvoiceTable from "./InvoiceTable";

const InvoiceManagement = async ({
  searchParams,
}: {
  searchParams: Promise<{
    searchString?: string;
    skip?: number;
    limit?: number;
    sortKey?: string;
    sortDirection?: SORT_DIRECTION;
    role?: USER_ROLES;
  }>;
}) => {
  const { searchString, role, skip, limit, sortKey, sortDirection } =
    await searchParams;
  const [data, invoiceStats] = await Promise.all([
    getRequest<{ data: { data: Invoice[]; count: number } }, GetParamsType>(
      API_END_POINTS.INVOICES,
      {
        ...(searchString && { searchString }),
        ...(role && { role }),
        ...(skip && { skip }),
        ...(limit && { limit }),
        ...(sortKey && { sortKey, sortDirection }),
      },
    ),
    getRequest<
      {
        data: {
          totalInvoices: number;
          totalUsers: number;
          totalPaid: number;
          totalPending: number;
        };
      },
      GetParamsType
    >(API_END_POINTS.INVOICES_STATS, {}),
  ]);
  console.log(invoiceStats, "dsfkmsdklf");
  const stats = [
    {
      value: invoiceStats.data.totalUsers,
      subtitle: "Users",
      icon: <Users className="w-5 h-5" />,
      color: "bg-purple-100 text-purple-600",
    },
    {
      value: invoiceStats.data.totalInvoices,
      subtitle: "Invoices",
      icon: <CreditCard className="w-5 h-5" />,
      color: "bg-red-100 text-red-600",
    },
    {
      value: invoiceStats.data.totalPaid,
      subtitle: "Paid",
      icon: <UserCheck className="w-5 h-5" />,
      color: "bg-green-100 text-green-600",
    },
    {
      value: invoiceStats.data.totalPending,
      subtitle: "Unpaid",
      icon: <Clock className="w-5 h-5" />,
      color: "bg-orange-100 text-orange-600",
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

          {/* Table Controls */}
          <div className="p-6 dark:border-gray-800">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <SearchToolbar
                  initialQuery={searchString || ""}
                  placeholder="Search Invoices"
                />
                <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Download size={18} />
                  <span>Export</span>
                </button>
                <RedirectButton />
              </div>
              {/* <div className="flex justify-end items-center gap-x-3">
                <h2 className="text-lg font-semibold text-gray-900 ">
                  Filters
                </h2>

                <SelectFilter
                  paramName="role"
                  options={INVOICE_STATUS_OPTIONS}
                  placeholder="Filter by Role"
                  className="w-60"
                />
              </div> */}
            </div>
          </div>
        </div>
        {/* table comp here */}
        <InvoiceTable data={data} />
      </div>
    </div>
  );
};

export default InvoiceManagement;
