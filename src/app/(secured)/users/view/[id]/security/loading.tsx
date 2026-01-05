"use client";

import { useId } from "react";
import { Skeleton } from "@/components/atoms/Skeleton";

const Loading = () => {
  const baseId = useId();

  return (
    <div className="space-y-6 animate-pulse">
      {/* Change Password Card */}
      <div className="bg-white rounded-lg shadow p-4 dark:bg-gray-900 dark:border-gray-800">
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="bg-orange-100 rounded-lg shadow p-4 mb-4">
          <div className="flex justify-end">
            <Skeleton className="h-6 w-6 rounded" />
          </div>
          <Skeleton className="h-5 w-64 mb-2" />
          <Skeleton className="h-4 w-56" />
        </div>
        <form>
          <div className="grid grid-cols-2 gap-x-2">
            <div className="mb-4">
              <Skeleton className="h-4 w-24 mb-2" />
              <div className="mt-1 relative">
                <Skeleton className="h-10 w-full rounded" />
                <Skeleton className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5" />
              </div>
            </div>
            <div className="mb-4">
              <Skeleton className="h-4 w-32 mb-2" />
              <div className="mt-1 relative">
                <Skeleton className="h-10 w-full rounded" />
                <Skeleton className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5" />
              </div>
            </div>
          </div>
          <Skeleton className="h-10 w-full mt-4 rounded" />
        </form>
      </div>
      {/* Recent Devices Card */}
      <div className="bg-white shadow rounded-lg overflow-hidden dark:bg-gray-900 dark:border-gray-800">
        <div className="px-6 py-4 border-b">
          <Skeleton className="h-6 w-40" />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-600">
            <thead className="bg-white border-b text-[0.875rem] text-[#A3AED0] uppercase">
              <tr>
                {["Browser", "Device", "Location", "Recent Activities"].map(
                  (col, id) => (
                    <th key={`${baseId}-header-${id}`} className="px-6 py-3">
                      <Skeleton className="h-4 w-24" />
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {Array.from(new Array(3)).map((_, rowId) => (
                <tr key={`${baseId}-row-${rowId}`}>
                  {Array.from(new Array(4)).map((_, colId) => (
                    <td
                      key={`${baseId}-col-${rowId}-${colId}`}
                      className="px-6 py-4"
                    >
                      <Skeleton className="h-4 w-24" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Loading;
