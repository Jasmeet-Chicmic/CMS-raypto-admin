"use client";

import { useId } from "react";
import { Skeleton } from "@/components/atoms/Skeleton";

const Loading = () => {
  const baseId = useId();

  return (
    <div>
      <div className="bg-white rounded-lg shadow p-6 space-y-6 animate-pulse dark:bg-[#1a1a1a] dark:border-[#1e2939]">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-10 w-32 rounded" />
        </div>
        <div className="space-y-4 dark:bg-[#1a1a1a] dark:border-[#1e2939]">
          {Array.from(new Array(3)).map((_, id) => (
            <div
              key={`${baseId}-card-${id}`}
              className="flex items-center justify-between border rounded px-4 py-3 dark:bg-[#1a1a1a] dark:border-[#1e2939]"
            >
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-16 rounded" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-5 w-16 rounded" />
                  </div>
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>
              <div className="text-right space-y-1">
                <div className="flex gap-2 justify-end mb-1">
                  <Skeleton className="h-6 w-12 rounded" />
                  <Skeleton className="h-6 w-12 rounded" />
                </div>
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6 space-y-6 dark:bg-[#1a1a1a] dark:border-[#1e2939] dark:text-[#CCCFD1] animate-pulse">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-10 w-36 rounded-md" />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-3">
            {Array.from(new Array(6)).map((_, id) => (
              <div key={`${baseId}-left-${id}`}>
                <Skeleton className="h-4 w-28 mb-1" />
                <Skeleton className="h-4 w-40" />
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="space-y-3">
            {Array.from(new Array(4)).map((_, id) => (
              <div key={`${baseId}-right-${id}`}>
                <Skeleton className="h-4 w-40 mb-1" />
                <Skeleton className="h-4 w-48" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
