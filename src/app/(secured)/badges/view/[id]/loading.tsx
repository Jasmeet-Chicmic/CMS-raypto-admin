"use client";

import { useId } from "react";
import { Skeleton } from "@/components/atoms/Skeleton";

const BadgeViewLoading = () => {
  const baseId = useId();

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6 space-y-6 border border-gray-200 animate-pulse">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="w-20 h-20 rounded-full overflow-hidden border relative">
          <Skeleton className="w-full h-full rounded-full" />
        </div>
        <div className="flex-1 space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      {/* Conditions */}
      <div>
        <Skeleton className="h-5 w-32 mb-4" />
        <div className="max-h-60 overflow-y-auto pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {Array.from(new Array(6)).map((_, id) => (
              <div
                key={`${baseId}-condition-${id}`}
                className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-md border"
              >
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadgeViewLoading;
