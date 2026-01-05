"use client";

import { useId } from "react";
import { Skeleton } from "@/components/atoms/Skeleton";

export default function Loading() {
  const baseId = useId();

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="space-y-6 mt-[20px]">
        <div className="overflow-x-auto">
          {/* Search Bar Skeleton */}
          <div className="bg-white rounded-t-lg shadow-sm border border-gray-200 dark:bg-gray-900 dark:border-gray-800">
            <div className="p-6 dark:border-gray-800">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-64 rounded-lg" />
                </div>
              </div>
            </div>
          </div>

          {/* Table Skeleton */}
          <div className="bg-white shadow-sm border border-gray-200 dark:bg-gray-900 dark:border-gray-800">
            {/* Table Header */}
            <div className="grid grid-cols-7 gap-4 p-4 border-b border-gray-200 dark:border-gray-800">
              {Array.from(new Array(7)).map((_, id) => (
                <Skeleton key={`${baseId}-header-${id}`} className="h-4 w-20" />
              ))}
            </div>

            {/* Table Rows */}
            {Array.from(new Array(10)).map((_, rowId) => (
              <div
                key={`${baseId}-row-${rowId}`}
                className="grid grid-cols-7 gap-4 p-4 border-b border-gray-100 dark:border-gray-800"
              >
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-28 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>

          {/* Pagination Skeleton */}
          <div className="bg-white rounded-b-lg shadow-sm border border-gray-200 dark:bg-gray-900 dark:border-gray-800 p-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-40" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
