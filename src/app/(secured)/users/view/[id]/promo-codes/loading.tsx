"use client";

import { useId } from "react";
import { Skeleton } from "@/components/atoms/Skeleton";

const Loading = () => {
  const baseId = useId();

  return (
    <main className="flex-1 overflow-y-auto animate-pulse">
      <div className="space-y-6 mt-[20px]">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {["bg-blue-100", "bg-green-100", "bg-orange-100"].map((bg, id) => (
            <div
              key={`${baseId}-stat-${id}`}
              className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 dark:bg-gray-900 dark:border-gray-800"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-full">
                  <Skeleton className="h-4 w-24 mb-1" />
                  <div className="flex items-center space-x-2 mt-1">
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${bg}`}>
                  <Skeleton className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Assigned Promo Codes Header */}
        <div className="bg-white rounded-lg shadow p-6 space-y-6 dark:bg-gray-900 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-8 w-40" />
          </div>

          {/* Table */}
          <div className="bg-white overflow-auto shadow-sm dark:bg-gray-900 dark:border-gray-800">
            <table className="min-w-full divide-y">
              <thead className="bg-white dark:bg-gray-800">
                <tr>
                  {["Name", "Code", "Assigned On", "Actions"].map((_, id) => (
                    <th
                      key={`${baseId}-header-${id}`}
                      className="px-4 py-3 text-left text-[0.875] font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400"
                    >
                      <Skeleton className="h-3 w-20" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {Array.from(new Array(7)).map((_, id) => (
                  <tr key={`${baseId}-row-${id}`}>
                    <td className="px-4 py-2">
                      <Skeleton className="h-4 w-40 mb-1" />
                      <Skeleton className="h-3 w-60" />
                    </td>
                    <td className="px-4 py-2">
                      <Skeleton className="h-4 w-32" />
                    </td>
                    <td className="px-4 py-2">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="px-4 py-2">
                      <Skeleton className="h-8 w-8 rounded" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-6 py-4 rounded-b-xl flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0 border-t dark:bg-gray-900">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-32" />
            </div>
            <div className="flex items-center space-x-2 lg:flex-row gap-2 flex-col">
              <div className="flex space-x-2 items-center">
                {Array.from(new Array(3)).map((_, id) => (
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
};

export default Loading;
