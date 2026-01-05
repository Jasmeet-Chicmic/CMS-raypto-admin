"use client";

import { useId } from "react";
import { Skeleton } from "@/components/atoms/Skeleton";

const NotificationsLoading = () => {
  const baseId = useId();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6 animate-pulse dark:bg-gray-900 dark:border-gray-800">
      {/* Header */}
      <div>
        <Skeleton className="h-6 w-40 mb-2" />
        <Skeleton className="h-4 w-64" />
        <div className="border-t border-gray-200 mt-4" />
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-4 gap-4 py-3 border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-12 mx-auto" />
        <Skeleton className="h-4 w-12 mx-auto" />
        <Skeleton className="h-4 w-12 mx-auto" />
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-200 space-y-2 dark:bg-gray-900 dark:border-gray-800">
        {Array.from(new Array(4)).map((_, rowId) => (
          <div
            key={`${baseId}-row-${rowId}`}
            className="grid grid-cols-4 gap-4 py-4 items-center"
          >
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-5 w-5 mx-auto rounded" />
            <Skeleton className="h-5 w-5 mx-auto rounded" />
            <Skeleton className="h-5 w-5 mx-auto rounded" />
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-6 dark:bg-gray-900 dark:border-gray-800">
        <Skeleton className="h-10 w-32 rounded" />
        <Skeleton className="h-10 w-24 rounded" />
      </div>
    </div>
  );
};

export default NotificationsLoading;
