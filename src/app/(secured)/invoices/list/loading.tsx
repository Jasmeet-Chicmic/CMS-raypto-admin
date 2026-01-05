"use client";

import { useId } from "react";
import { Skeleton } from "@/components/atoms/Skeleton";

export default function InvoicesListSkeleton() {
  const baseId = useId();

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="space-y-6 p-0 mt-[20px]">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {["bg-purple-100", "bg-red-100", "bg-green-100", "bg-orange-100"].map(
            (bg, id) => (
              <div
                key={`${baseId}-stat-${id}`}
                className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 dark:bg-gray-900 dark:border-gray-800"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-full">
                    <div className="flex items-center space-x-2 mt-1">
                      <Skeleton className="h-8 w-16" />
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
          <div className="bg-white rounded-t-lg shadow-sm border border-gray-200 dark:bg-gray-900 dark:border-gray-800">
            <div className="p-6 dark:border-gray-800">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Skeleton className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                    <Skeleton className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-60 bg-gray-100 h-10" />
                  </div>
                  <Skeleton className="h-10 w-24" />
                  <Skeleton className="h-10 w-36" />
                </div>
                <div className="flex justify-end items-center gap-x-3">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="w-60 h-10" />
                </div>
              </div>
            </div>
          </div>

          {/* Table Skeleton */}
          <div className="bg-white overflow-auto shadow-sm dark:bg-gray-900 dark:border-gray-800">
            <table className="min-w-full divide-y">
              <thead className="bg-white dark:bg-gray-900 dark:border-gray-800">
                <tr>
                  {/* Checkbox */}
                  <th className="px-4 py-3 w-[60px]">
                    <Skeleton className="h-4 w-4 rounded" />
                  </th>
                  {/* Invoice No., Issued on, Client Name, Invoice Amount, Due by, Status, Actions */}
                  {Array.from(new Array(7)).map((_, id) => (
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
                    {/* Invoice No. */}
                    <td className="px-4 py-[6px] min-w-[120px]">
                      <Skeleton className="h-4 w-16" />
                    </td>
                    {/* Issued on */}
                    <td className="px-4 py-[6px] min-w-[120px]">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    {/* Client Name */}
                    <td className="px-4 py-[6px] min-w-[120px]">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    {/* Invoice Amount */}
                    <td className="px-4 py-[6px] min-w-[120px]">
                      <Skeleton className="h-4 w-20" />
                    </td>
                    {/* Due by */}
                    <td className="px-4 py-[6px] min-w-[120px]">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    {/* Status */}
                    <td className="px-4 py-[6px] min-w-[120px]">
                      <Skeleton className="h-6 w-16 rounded-md" />
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-[6px] min-w-[120px]">
                      <div className="flex items-center space-x-2">
                        <Skeleton className="h-6 w-6 rounded" />
                        <Skeleton className="h-6 w-6 rounded" />
                        <Skeleton className="h-6 w-6 rounded" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Skeleton */}
          <div className="bg-white px-6 py-4 rounded-b-xl flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0 border-t dark:bg-gray-900 dark:border-gray-800">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-32" />
            </div>
            <div className="flex items-center space-x-2 lg:flex-row gap-2 flex-col">
              <div className="flex space-x-2 items-center">
                {Array.from(new Array(7)).map((_, id) => (
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
