"use client";

import { useId } from "react";
import { Skeleton } from "@/components/atoms/Skeleton";

const ApplicationsLoading = () => {
  const baseId = useId();

  return (
    <div className="space-y-6 animate-pulse">
      {/* Header and Search */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-40" /> {/* Title */}
        <div className="flex items-center gap-2 w-72">
          <div className="relative w-full">
            <Skeleton className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
            <Skeleton className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full h-10" />
          </div>
        </div>
      </div>

      {/* Application Cards */}
      {Array.from(new Array(2)).map((_, id) => (
        <div
          key={`${baseId}-app-${id}`}
          className="bg-white border rounded-2xl p-6 shadow flex flex-col gap-4 relative dark:bg-gray-900 dark:border-gray-800"
        >
          {/* Top Row: Avatar, Name, Resume, Menu */}
          <div className="flex items-center gap-4">
            <Skeleton className="w-10 h-10 rounded-full" />

            <div className="flex flex-col flex-1">
              <Skeleton className="h-4 w-32" />
            </div>

            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-24 rounded-md" />
            </div>

            <Skeleton className="h-6 w-6 rounded-full" />
          </div>

          {/* Applied For */}
          <div className="mt-2 space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-72" />
          </div>

          {/* Cover Letter */}
          <div className="mt-2 space-y-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-80" />
          </div>

          {/* Skills */}
          <div className="mt-2 space-y-2">
            <Skeleton className="h-3 w-24" />
            <div className="flex gap-2 flex-wrap">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </div>

          {/* Bottom Row: Rating, Location, Buttons */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-gray-500">
                {Array.from(new Array(5)).map((_, starId) => (
                  <Skeleton
                    key={`${baseId}-star-${id}-${starId}`}
                    className="h-4 w-4"
                  />
                ))}
                <Skeleton className="ml-2 h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>

            <div className="flex gap-2">
              <Skeleton className="h-8 w-24 rounded-md" />
              <Skeleton className="h-8 w-24 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApplicationsLoading;
