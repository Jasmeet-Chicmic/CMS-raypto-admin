"use client";

import { useId } from "react";
import { Skeleton } from "@/components/atoms/Skeleton";

export default function TransactionsListSkeleton() {
  const baseId = useId();

  return (
    <main className="flex-1 overflow-y-auto animate-pulse">
      <div className="space-y-6 p-0 mt-[20px]">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {["bg-purple-100", "bg-red-100", "bg-green-100", "bg-orange-100"].map(
            (bg, id) => (
              <div
                key={`${baseId}-stat-${id}`}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-full">
                    <div className="flex items-center space-x-2 mt-1">
                      <Skeleton className="h-8 w-20" />
                    </div>
                    <Skeleton className="h-3 w-16 mt-2" />
                  </div>
                  <div className={`p-3 rounded-lg ${bg}`}>
                    {" "}
                    {/* colored icon bg */}
                    <Skeleton className="h-5 w-5" />
                  </div>
                </div>
              </div>
            ),
          )}
        </div>

        {/* Filters and Actions */}
        <div className="overflow-x-auto">
          <div className="bg-white rounded-t-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="relative w-60">
                    <Skeleton className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                    <Skeleton className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full bg-gray-100 h-10" />
                  </div>
                  <Skeleton className="h-10 w-24" />
                </div>
                <div className="flex justify-end items-center gap-x-3">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="w-60 h-10" />
                </div>
              </div>
            </div>
          </div>

          {/* Table Skeleton */}
          <div className="bg-white overflow-auto shadow-sm">
            <table className="min-w-full divide-y">
              <thead className="bg-white">
                <tr>
                  {/* Checkbox */}
                  <th className="px-4 py-3 w-[60px]">
                    <Skeleton className="h-4 w-4 rounded" />
                  </th>
                  {/* Transaction ID, Method, Type, Description, Amount */}
                  {Array.from(new Array(5)).map((_, id) => (
                    <th key={`${baseId}-header-${id}`} className="px-4 py-3">
                      <Skeleton className="h-3 w-20" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {Array.from(new Array(7)).map((_, rowId) => (
                  <tr key={`${baseId}-row-${rowId}`}>
                    {/* Checkbox */}
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-4 rounded" />
                    </td>
                    {/* Transaction ID */}
                    <td className="px-4 py-[6px] min-w-[120px]">
                      <Skeleton className="h-4 w-16" />
                    </td>
                    {/* Method (icon + label) */}
                    <td className="px-4 py-[6px] min-w-[120px]">
                      <div className="flex items-center">
                        <Skeleton className="inline-flex h-6 w-6 rounded-md" />
                        <Skeleton className="ml-2 h-4 w-20" />
                      </div>
                    </td>
                    {/* Type (Credit/Debit badge) */}
                    <td className="px-4 py-[6px] min-w-[120px]">
                      <Skeleton className="h-6 w-16 rounded-md" />
                    </td>
                    {/* Description */}
                    <td className="px-4 py-[6px] min-w-[120px]">
                      <Skeleton className="h-4 w-32" />
                    </td>
                    {/* Amount */}
                    <td className="px-4 py-[6px] min-w-[120px]">
                      <Skeleton className="h-4 w-16" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Skeleton */}
          <div className="bg-white px-6 py-4 rounded-b-xl flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0 border-t">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="flex items-center space-x-2 lg:flex-row gap-2 flex-col">
              <div className="flex space-x-2 items-center">
                {Array.from(new Array(8)).map((_, id) => (
                  <Skeleton
                    key={`${baseId}-page-${id}`}
                    className="h-8 w-8 rounded"
                  />
                ))}
              </div>
              <div className="flex items-center space-x-2 w-full">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-12" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
