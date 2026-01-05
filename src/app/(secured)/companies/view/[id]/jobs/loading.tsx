"use client";

import { useId } from "react";
import { Skeleton } from "@/components/atoms/Skeleton";

const JobsLoading = () => {
  const baseId = useId();

  return (
    <div className="space-y-6 animate-pulse">
      {/* Top Bar: Search + Create Button */}
      <div className="flex justify-between items-center">
        <div className="relative w-full">
          <Skeleton className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
          <Skeleton className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full h-10" />
        </div>
        <Skeleton className="h-10 w-32 rounded-md ml-2" />
      </div>

      {/* Job Card Skeleton */}
      {Array.from(new Array(2)).map((_, id) => (
        <div
          key={`${baseId}-job-${id}`}
          className="bg-white p-5 rounded-xl border space-y-3 shadow-sm dark:bg-gray-900 dark:border-gray-800"
        >
          {/* Title and Menu */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div>
                <Skeleton className="h-5 w-64 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <Skeleton className="h-5 w-5 rounded-full" />
          </div>

          {/* Meta info like Remote */}
          <div className="flex flex-wrap gap-3 text-sm text-gray-600">
            <Skeleton className="h-4 w-20" />
          </div>

          {/* Tech Stack Pills */}
          <div className="flex flex-wrap gap-2">
            {Array.from(new Array(5)).map((_, techId) => (
              <Skeleton
                key={`${baseId}-tech-${id}-${techId}`}
                className="h-6 w-20 rounded-full border border-gray-300"
              />
            ))}
          </div>

          {/* Job Description */}
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />

          {/* Action Buttons */}
          <div className="flex gap-3 mt-2">
            <Skeleton className="h-9 w-36 rounded-md" />
            <Skeleton className="h-9 w-24 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobsLoading;
